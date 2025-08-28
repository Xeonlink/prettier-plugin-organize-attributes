import type { Prettify } from "@/utils/type";
import type { JSXAttribute, JSXOpeningElement, Node } from "./type";

export type * from "./type";

function node<T extends string>(type: T & Node["type"], meta: Prettify<Omit<Node & { type: T }, "type">>) {
  // @ts-ignore
  meta.type = type;
  return meta as Node & { type: T };
}

function stringLiteral(value: string) {
  return node("StringLiteral", {
    value: value,
    extra: {
      rawValue: value,
      raw: `"${value}"`,
    },
  });
}

function jsxIdentifier(name: string) {
  return node("JSXIdentifier", {
    name,
  });
}

function jsxNamespacedName(namespace: string, name: string) {
  return node("JSXNamespacedName", {
    namespace: jsxIdentifier(namespace),
    name: jsxIdentifier(name),
  });
}

export const estree = {
  node,
  stringLiteral,
  jsxIdentifier,
  jsxNamespacedName,
};

export function getJSXAttributeKey(attribute: JSXAttribute): string {
  switch (attribute.name.type) {
    case "JSXIdentifier":
      return attribute.name.name;
    case "JSXNamespacedName":
      return attribute.name.name.name;
  }
}

export function getJSXOpeningElementTagName(jsxOpeningElement: JSXOpeningElement): string {
  switch (jsxOpeningElement.name.type) {
    case "JSXIdentifier":
      return jsxOpeningElement.name.name;
    case "JSXNamespacedName":
      return jsxOpeningElement.name.name.name;
    case "JSXMemberExpression":
      return jsxOpeningElement.name.property.name;
  }
}
