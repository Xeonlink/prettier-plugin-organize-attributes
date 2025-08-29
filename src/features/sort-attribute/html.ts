import { defineAstModifier } from "@/ast";
import { PRESET } from "./preset";
import type { Attribute, Node } from "@/ast/html";
import { options } from "./options";
import { regex } from "@/utils/utils";

function* sliceByGroup(attributeGroups: string[], attributes: Attribute[]) {
  let result = [...attributes];

  const attributeRegExGroups = attributeGroups
    .map((group) => PRESET[group] ?? group)
    .flat()
    .map(regex);

  for (const regex of attributeRegExGroups) {
    const matched = result.filter((attribute) => regex.test(attribute.name));
    yield matched;
    result = result.filter((attribute) => !matched.includes(attribute));
  }

  yield result;
}

export const withHtmlModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { sortAttribute, sortAttributeGroup, sortAttributeOrder, sortAttributeIgnoreCase } = options;
  if (!["on", "html"].includes(sortAttribute)) return;

  if (node.type === "element") {
    const attributes = node.attrs;
    const result = [];

    for (const slice1 of sliceByGroup(sortAttributeGroup, attributes)) {
      slice1.sort((a, b) => {
        const aKey = a.name;
        const bKey = b.name;

        const compare = aKey.localeCompare(bKey, undefined, {
          sensitivity: sortAttributeIgnoreCase ? "base" : "case",
          numeric: true,
        });

        switch (sortAttributeOrder) {
          case "ASC":
            return compare;
          case "DESC":
            return -compare;
        }
      });

      result.push(...slice1);
    }

    node.attrs = result;
  }
});
