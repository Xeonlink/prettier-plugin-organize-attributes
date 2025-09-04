import { defineAstModifier, travelAst } from "@/ast";
import type { JSXAttribute, JSXOpeningElement, JSXSpreadAttribute, Node } from "@/ast/estree";
import { getJSXAttributeKey } from "@/ast/estree";
import type { Options } from "./options";
import { miniOrganize } from "./organize";
import { PRESET } from "./presets";

function* sliceBySpread(attributes: JSXOpeningElement["attributes"]) {
  const result = [...attributes];

  while (result.length) {
    const index = result.findIndex((attribute) => attribute.type === "JSXSpreadAttribute");
    if (index === -1) {
      yield result.splice(0, result.length) as JSXAttribute[];
      break;
    }
    yield result.splice(0, index) as JSXAttribute[];
    yield result.splice(0, 1)[0] as JSXSpreadAttribute;
  }
}

export const createEstreeParser = defineAstModifier<Node, Options>("estree", (node, options) => {
  const attributeGroups = [...options.attributeGroups];
  const attributeIgnoreCase = options.attributeIgnoreCase;
  const attributeSort = options.attributeSort;

  if (attributeGroups.length === 0) {
    attributeGroups.push(PRESET.keys.$HTML);
  }

  travelAst(node, (node) => {
    if (node.type === "JSXOpeningElement") {
      const result = [];

      for (const slice1 of sliceBySpread(node.attributes)) {
        if (Array.isArray(slice1)) {
          const organized = miniOrganize(slice1, {
            groups: attributeGroups,
            ignoreCase: attributeIgnoreCase,
            sort: attributeSort,
            getKey: getJSXAttributeKey,
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
