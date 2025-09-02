import { defineAstModifier, travelAst } from "./ast";
import type { AST } from "./ast/svelt";
import type { Options } from "./options";
import { miniOrganize } from "./organize";
import { PRESET } from "./preset";

const elementLikeNodeTypes = new Set(
  Object.keys({
    Component: true,
    RegularElement: true,
    SlotElement: true,
    TitleElement: true,
    SvelteBody: true,
    SvelteBoundary: true,
    SvelteComponent: true,
    SvelteDocument: true,
    SvelteElement: true,
    SvelteFragment: true,
    SvelteHead: true,
    SvelteOptions: true,
    SvelteSelf: true,
    SvelteWindow: true,
  } satisfies Record<AST.ElementLike["type"], true>),
);

function isElementLikeNode(node: AST.SvelteNode): node is AST.ElementLike {
  return elementLikeNodeTypes.has(node.type);
}

type AttributeCandidate = AST.ElementLike["attributes"][number];
type AttributeCandidateExcludeSpreadAttribute = Exclude<AttributeCandidate, AST.SpreadAttribute>;

function getAttributeKey(node: AttributeCandidateExcludeSpreadAttribute): string {
  switch (node.type) {
    case "Attribute":
      return node.name;
    case "AttachTag":
      return "@attach";
    case "TransitionDirective":
      const directiveType = node.intro ? "in" : node.outro ? "out" : "transition";
      return `${directiveType}:${node.name}${node.modifiers.map((modifier) => `|${modifier}`).join("")}`;
    default:
      return `${node.type.replace("Directive", "").toLowerCase()}:${node.name}`;
  }
}

function* sliceBySpread(attributes: AttributeCandidate[]) {
  const result = [...attributes];

  while (result.length) {
    const index = result.findIndex((attribute) => attribute.type === "SpreadAttribute");
    if (index === -1) {
      yield result.splice(0, result.length) as AttributeCandidateExcludeSpreadAttribute[];
      break;
    }
    yield result.splice(0, index) as AttributeCandidateExcludeSpreadAttribute[];
    yield result.splice(0, 1)[0] as AST.SpreadAttribute;
  }
}

export const createSveltParser = defineAstModifier<AST.SvelteNode, Options>("svelte-ast", (node, options) => {
  const attributeGroups = [...options.attributeGroups];
  const attributeIgnoreCase = options.attributeIgnoreCase;
  const attributeSort = options.attributeSort;

  if (attributeGroups.length === 0) {
    attributeGroups.push(PRESET.keys.$HTML);
  }

  travelAst(node, (node) => {
    if (isElementLikeNode(node)) {
      const result = [];

      for (const slice1 of sliceBySpread(node.attributes)) {
        if (Array.isArray(slice1)) {
          const organized = miniOrganize(slice1, {
            groups: attributeGroups,
            ignoreCase: attributeIgnoreCase,
            sort: attributeSort,
            getKey: getAttributeKey,
          });

          result.push(...organized);
        } else {
          result.push(slice1);
        }
      }

      node.attributes = result;
    }
  });
});
