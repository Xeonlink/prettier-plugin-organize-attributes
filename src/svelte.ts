import { defineAstModifier, travelAst } from "./ast";
import type {
  AttachTag,
  AttributeNode,
  BindingNode,
  EventHandlerNode,
  Node,
  SpreadNode,
  StyleDirectiveNode,
  TransitionNode,
} from "./ast/svelt";
import type { Options } from "./options";
import { miniOrganize } from "./organize";
import { PRESET } from "./preset";
import type { ValueOf } from "./utils/type";

type ElementLike = ValueOf<{
  [key in Exclude<Node["type"], "Script" | "Style">]: Omit<Node & { type: key }, "type"> extends { attributes: any }
    ? Node & { type: key; attributes: AttributeCandidate[] }
    : never;
}>;

const elementLikeNodeTypes = new Set(
  Object.keys({
    Body: true,
    Document: true,
    Element: true,
    Head: true,
    InlineComponent: true,
    Options: true,
    Slot: true,
    SlotTemplate: true,
    Title: true,
    Window: true,
  } satisfies Record<ElementLike["type"], true>),
);

function isElementLikeNode(node: Node): node is ElementLike {
  return elementLikeNodeTypes.has(node.type);
}

type AttributeCandidate =
  | AttributeNode
  | SpreadNode
  | BindingNode
  | EventHandlerNode
  | TransitionNode
  | AttachTag
  | StyleDirectiveNode;
type AttributeCandidateExcludeSpreadNode = Exclude<AttributeCandidate, SpreadNode>;

function getAttributeKey(node: AttributeCandidateExcludeSpreadNode): string {
  switch (node.type) {
    case "Attribute":
      return node.name;
    case "Binding":
      return `bind:${node.name}`;
    case "EventHandler":
      return `on:${node.name}`;
    case "Transition":
      const directiveType = node.intro ? "in" : node.outro ? "out" : "transition";
      return `${directiveType}:${node.name}${node.modifiers?.map((modifier) => `|${modifier}`)?.join("") ?? ""}`;
    case "AttachTag":
      return "@attach";
    case "StyleDirective":
      return `style:${node.name}`;
  }
}

function* sliceBySpread(attributes: AttributeCandidate[]) {
  const result = [...attributes];

  while (result.length) {
    const index = result.findIndex((attribute) => attribute.type === "Spread");
    if (index === -1) {
      yield result.splice(0, result.length) as AttributeCandidateExcludeSpreadNode[];
      break;
    }
    yield result.splice(0, index) as AttributeCandidateExcludeSpreadNode[];
    yield result.splice(0, 1)[0] as SpreadNode;
  }
}

export const createSvelteParser = defineAstModifier<Node, Options>("svelte-ast", (node, options) => {
  const attributeGroups = [...options.attributeGroups];
  const attributeIgnoreCase = options.attributeIgnoreCase;
  const attributeSort = options.attributeSort;

  if (attributeGroups.length === 0) {
    attributeGroups.push(PRESET.keys.$SVELTE);
  }

  travelAst(node, (node) => {
    if (isElementLikeNode(node)) {
      const attributes = [];

      for (const slice1 of sliceBySpread(node.attributes)) {
        if (Array.isArray(slice1)) {
          const organized = miniOrganize(slice1, {
            groups: attributeGroups,
            ignoreCase: attributeIgnoreCase,
            sort: attributeSort,
            getKey: getAttributeKey,
          });
          attributes.push(...organized);
        } else {
          attributes.push(slice1);
        }
      }

      node.attributes = attributes;
      return;
    }

    if (node.type === "Style") {
      const lastAttribute = node.attributes[node.attributes.length - 1];
      const slice1 = node.attributes.slice(0, -1) as AttributeNode[];
      const organized = miniOrganize(slice1, {
        groups: attributeGroups,
        ignoreCase: attributeIgnoreCase,
        sort: attributeSort,
        getKey: getAttributeKey,
      });
      organized.push(lastAttribute as AttributeNode);
      node.attributes = organized;
      return;
    }
  });
});
