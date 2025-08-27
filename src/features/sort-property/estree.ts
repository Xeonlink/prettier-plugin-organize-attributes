import { defineAstModifier } from "@/ast";
import type { Node, Property, SpreadElement } from "@/ast/estree";
import { options } from "./options";
import { PRESET } from "./preset";

function getPropertyKey(property: Property) {
  switch (property.key.type) {
    case "PrivateIdentifier":
      return property.key.name;
    case "Identifier":
      return property.key.name;
    case "Literal":
      const value = property.key.value;
      if (typeof value === "undefined") return "/^&%$undefined$%&^/";
      if (typeof value === "object" && value === null) return "/^&%$null$%&^/";
      return value.toString();
    default:
      return "/^&%$Expression$%&^/";
  }
}

function* sliceByGroup(propertyGroups: string[], properties: Property[]) {
  let result = [...properties];

  const propertyRegExGroups = [...propertyGroups, "$EXPRESSION", "$NULL", "$UNDEFINED"]
    .map((group) => PRESET[group] ?? group)
    .flat()
    .map((group) => {
      const matched = group.match(/^\/(.*)\/([ig]*)$/);
      if (matched) {
        return new RegExp(matched[1], matched[2]);
      }
      return new RegExp(group);
    });

  for (const regex of propertyRegExGroups) {
    const matched = result.filter((property) => regex.test(getPropertyKey(property)));
    yield matched;
    result = result.filter((property) => !matched.includes(property));
  }

  yield result;
}

function* sliceBySpread(properties: (Property | SpreadElement)[]) {
  const result = [...properties];

  while (result.length) {
    const index = result.findIndex((property) => property.type === "SpreadElement");
    if (index === -1) {
      yield result.splice(0, result.length) as Property[];
      break;
    }
    yield result.splice(0, index) as Property[];
    yield result.splice(0, 1)[0] as SpreadElement;
  }
}

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { sortProperty, sortPropertyGroup, sortPropertyOrder, sortPropertyIgnoreCase } = options;
  if (!["on"].includes(sortProperty)) return;

  if (node.type === "ObjectExpression") {
    const properties = node.properties;
    const result = [];

    for (const slice1 of sliceBySpread(properties)) {
      if (Array.isArray(slice1)) {
        for (const slice2 of sliceByGroup(sortPropertyGroup, slice1)) {
          slice2.sort((a, b) => {
            const aKey = getPropertyKey(a);
            const bKey = getPropertyKey(b);

            const compare = aKey.localeCompare(bKey, undefined, {
              sensitivity: sortPropertyIgnoreCase ? "base" : "case",
              numeric: true,
            });

            switch (sortPropertyOrder) {
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

    node.properties = result;
  }
});
