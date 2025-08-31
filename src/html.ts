import { defineAstModifier, travelAst } from "@/ast";
import type { Attribute, Node } from "@/ast/html";
import type { Options } from "./options";
import { clearGroupDefs, createEmptyGroupDefs, grouping, trySorting } from "./organize";
import { PRESET } from "./preset";

export const withHtmlParser = defineAstModifier<Node, Options>((node, options) => {
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

  const groupDefs = createEmptyGroupDefs<Attribute>({
    attributeGroups,
    attributeIgnoreCase,
  });

  travelAst(node, (node) => {
    if (node.type === "element") {
      grouping(groupDefs, node.attrs, (attr) => attr.name);
      trySorting(groupDefs, attributeSort, (attr) => attr.name);
      node.attrs = groupDefs.flatMap((groupDef) => groupDef.values);
      clearGroupDefs(groupDefs);
    }
  });
});
