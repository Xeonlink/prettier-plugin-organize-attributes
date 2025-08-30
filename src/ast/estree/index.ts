import type {
  ArrowFunctionExpression,
  Comment,
  Identifier,
  JSXAttribute,
  JSXOpeningElement,
  Node,
  StringLiteral,
  VariableDeclarator,
} from "./type";

export * from "./function";
export type * from "./type";

function node<T extends Node["type"]>(type: T, meta: Omit<Node & { type: T }, "type">) {
  // @ts-ignore
  meta.type = type;
  return meta as Node & { type: T };
}

function stringLiteral(value: string, options: Omit<StringLiteral, "type" | "value" | "extra"> = {}) {
  return node("StringLiteral", {
    value: value,
    extra: {
      rawValue: value,
      raw: `"${value}"`,
    },
    ...options,
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

function arrowFunctionDeclaration(
  kind: "var" | "let" | "const" | "using" | "await using",
  meta: Omit<ArrowFunctionExpression, "type"> & { id: Identifier },
) {
  const { id, ...rest } = meta;
  return estree.node("VariableDeclaration", {
    kind,
    declarations: [
      estree.node("VariableDeclarator", {
        id,
        init: estree.node("ArrowFunctionExpression", rest),
      }),
    ],
  });
}

function declareVariables(kind: "var" | "let" | "const" | "using" | "await using", declarators: VariableDeclarator[]) {
  return estree.node("VariableDeclaration", {
    kind,
    declarations: declarators,
  });
}

function comment(type: "Line" | "Block", value: string, options: Omit<Comment, "type" | "value"> = {}): Comment {
  return {
    type,
    value,
    ...options,
  };
}

function identifier(name: string, options: Omit<Identifier, "type" | "name"> = {}) {
  return node("Identifier", {
    name,
    ...options,
  });
}

export const estree = {
  node,
  stringLiteral,
  jsxIdentifier,
  jsxNamespacedName,
  arrowFunctionDeclaration,
  declareVariables,
  comment,
  identifier,
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
