import { defineAstModifier } from "../../utils/ast-modifier";
import { PRESET } from "./preset";
import type { JSXAttribute, JSXSpreadAttribute, Node } from "../../ast/estree";
import { options } from "./options";

function getAttributeKey(attribute: JSXAttribute) {
  if (attribute.name.type === "JSXIdentifier") {
    return attribute.name.name;
  }
  if (attribute.name.type === "JSXNamespacedName") {
    return attribute.name.name.name;
  }
  return "";
}

function* sliceByGroup(attributeGroups: string[], attributes: JSXAttribute[]) {
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

function* sliceBySpread(attributes: (JSXAttribute | JSXSpreadAttribute)[]) {
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

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { attributeGroups, attributeIgnoreCase, attributeSort } = options;

  if (node.type === "JSXOpeningElement") {
    const attributes = node.attributes;
    const result = [];

    for (const slice1 of sliceBySpread(attributes)) {
      if (Array.isArray(slice1)) {
        for (const slice2 of sliceByGroup(attributeGroups, slice1)) {
          slice2.sort((a, b) => {
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

          result.push(...slice2);
        }
      } else {
        result.push(slice1);
      }
    }

    node.attributes = result;
  }
});
