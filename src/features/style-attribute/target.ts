import type { JSXAttribute, JSXExpressionContainer, Node, SimpleLiteral, StringLiteral } from "@/ast/estree";

type JSXAttributeNoBrace = Omit<JSXAttribute, "value"> & {
  value: SimpleLiteral | StringLiteral;
};

export function isJSXAttributeNoBrace(node: Node): node is JSXAttributeNoBrace {
  if (node.type !== "JSXAttribute") return false;

  switch (node.value?.type) {
    case "Literal":
      if (typeof node.value?.value !== "string") return false;
      if ("regex" in node.value) return false;
      if ("bigint" in node.value) return false;
      node.value;
      break;
    case "StringLiteral":
      break;
    default:
      return false;
  }

  return true;
}

type JSXAttributeWithBrace = Omit<JSXAttribute, "value"> & {
  value: Omit<JSXExpressionContainer, "expression"> & {
    expression: SimpleLiteral | StringLiteral;
  };
};

export function isJSXAttributeWithBrace(node: Node): node is JSXAttributeWithBrace {
  if (node.type !== "JSXAttribute") return false;
  if (node.value?.type !== "JSXExpressionContainer") return false;

  switch (node.value.expression.type) {
    case "Literal":
      if (typeof node.value.expression.value !== "string") return false;
      break;
    case "StringLiteral":
      break;
    default:
      return false;
  }

  return true;
}
