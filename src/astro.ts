import { defineAstModifier, travelAst } from "@/ast";
import type { AttributeNode, Node } from "@/ast/astro";
import type { PluginOptions } from "./options";
import { miniOrganize } from "./organize";
import type { ValueOf } from "./utils/type";

type ElementLike = ValueOf<{
  [key in Node["type"]]: Omit<Node & { type: key }, "type"> extends { attributes: any }
    ? Node & { type: key; attributes: AttributeNode[] }
    : never;
}>;

const elementLikeNodeTypes = new Set(
  Object.keys({
    "custom-element": true,
    component: true,
    element: true,
    fragment: true,
  } satisfies Record<ElementLike["type"], true>),
);

function isElementLikeNode(node: Node): node is ElementLike {
  return elementLikeNodeTypes.has(node.type);
}

function* sliceBySpread(attributes: AttributeNode[]) {
  const result = [...attributes];

  while (result.length) {
    const index = result.findIndex((attribute) => attribute.kind === "spread");
    if (index === -1) {
      yield result.splice(0, result.length) as AttributeNode[];
      break;
    }
    yield result.splice(0, index) as AttributeNode[];
    yield result.splice(0, 1)[0] as AttributeNode;
  }
}

export const createAstroParser = defineAstModifier<Node, PluginOptions>("astro", (node, options) => {
  const attributeGroups = [...options.attributeGroups];
  const attributeIgnoreCase = options.attributeIgnoreCase;
  const attributeSort = options.attributeSort;

  travelAst(node, (node) => {
    if (isElementLikeNode(node)) {
      const result = [];

      for (const slice1 of sliceBySpread(node.attributes)) {
        if (Array.isArray(slice1)) {
          const organized = miniOrganize(slice1, {
            groups: attributeGroups,
            ignoreCase: attributeIgnoreCase,
            sort: attributeSort,
            getKey: (attr) => attr.name,
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
