import { defineAstModifier } from "@/ast";
import { PRESET } from "./preset";
import type { AttributeNode, Node } from "@/ast/html";
import { options } from "./options";

function getAttributeKey(attribute: AttributeNode) {
  return attribute.name;
}

function* sliceByGroup(attributeGroups: string[], attributes: AttributeNode[]) {
  let result = [...attributes];

  const attributeRegExGroups = attributeGroups
    .map((group) => PRESET[group] ?? group)
    .flat()
    .map((group) => {
      const matched = group.match(/^\/(.*)\/([ig]*)$/);
      if (matched) {
        return new RegExp(matched[1], matched[2]);
      }
      return new RegExp(group);
    });

  for (const regex of attributeRegExGroups) {
    const matched = result.filter((attribute) => regex.test(getAttributeKey(attribute)));
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
        let aKey = getAttributeKey(a);
        let bKey = getAttributeKey(b);

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
