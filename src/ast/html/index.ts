import { defineAstModifier } from "../../ast-modifier";
import { PRESET } from "../../preset";
import type { AttributeNode, Node } from "./type";

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

export const withHtmlModifier = defineAstModifier((node: Node, options) => {
  const { attributeGroups, attributeIgnoreCase, attributeSort } = options;

  if (node.type === "element") {
    const attributes = node.attrs;
    const result = [];

    for (const slice1 of sliceByGroup(attributeGroups, attributes)) {
      slice1.sort((a, b) => {
        let aKey = getAttributeKey(a);
        let bKey = getAttributeKey(b);

        const compare = aKey.localeCompare(bKey, undefined, {
          sensitivity: attributeIgnoreCase ? "base" : "case",
          numeric: true,
        });

        switch (attributeSort) {
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
