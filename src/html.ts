import { defineAstModifier, travelAst } from "@/ast";
import type { Node } from "@/ast/html";
import type { PluginOptions } from "./options";
import { miniOrganize } from "./organize";
import { PRESET } from "./presets";

export const createHtmlParser = defineAstModifier<Node, PluginOptions>("html", (node, options) => {
  const attributeGroups = [...options.attributeGroups];
  const attributeIgnoreCase = options.attributeIgnoreCase;
  const attributeSort = options.attributeSort;

  if (attributeGroups.length === 0) {
    switch (options.parser) {
      case "vue":
        attributeGroups.push(PRESET.keys.$VUE);
        break;
      case "angular":
        attributeGroups.push(PRESET.keys.$ANGULAR);
        break;
      case "html":
      default:
        attributeGroups.push(PRESET.keys.$HTML);
    }
  }

  travelAst(node, (node) => {
    if (node.type === "element") {
      const organized = miniOrganize(node.attrs, {
        groups: attributeGroups,
        ignoreCase: attributeIgnoreCase,
        sort: attributeSort,
        getKey: (attr) => attr.name,
      });

      node.attrs = organized;
    }
  });
});
