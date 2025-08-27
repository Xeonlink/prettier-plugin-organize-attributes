import type { Node } from "estree-jsx";

export type * from "estree-jsx";

function node<T extends string>(type: T & Node["type"], meta: Omit<Node & { type: T }, "type">) {
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
