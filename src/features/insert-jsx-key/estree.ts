import { type Node, estree } from "@/ast/estree";
import { defineAstModifier } from "@/ast";
import { options } from "./options";

/**
 * 노드가 대상 노드인지 확인합니다.
 *
 * @param node - 형태를 확인할 노드
 * @example (expression).map((item) => <div key={item}>{item}</div>)
 * @returns 노드가 대상 노드이면 true, 그렇지 않으면 false
 */
function isTargetNode(node: Node): boolean {
  if (node.type !== "CallExpression") return false;
  if (node.callee.type !== "MemberExpression") return false;

  switch (node.callee.property.type) {
    case "PrivateIdentifier":
      if (node.callee.property.name !== "map") return false;
      break;
    case "Identifier":
      if (node.callee.property.name !== "map") return false;
      break;
    // @ts-ignore
    case "StringLiteral":
      // @ts-ignore
      if (node.callee.property.value !== "map") return false;
      break;
    case "TemplateLiteral":
      if (node.callee.property.quasis.length !== 1) return false;
      if (node.callee.property.quasis[0].value.raw !== "map") return false;
      break;
    default:
      return false;
  }

  if (node.arguments.length !== 1) return false;
  if (node.arguments[0].type !== "ArrowFunctionExpression") return false;
  if (node.arguments[0].body.type !== "JSXElement") return false;
  if (node.arguments[0].body.openingElement.type !== "JSXOpeningElement") return false;

  const hasKey = node.arguments[0].body.openingElement.attributes.some((attribute) => {
    if (attribute.type === "JSXSpreadAttribute") return false;

    switch (attribute.name.type) {
      case "JSXIdentifier":
        return attribute.name.name === "key";
      case "JSXNamespacedName":
        return attribute.name.name.name === "key";
    }
  });

  return !hasKey;
}

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { insertJsxKey } = options;
  if (!["on"].includes(insertJsxKey)) return;

  if (isTargetNode(node)) {
    // @ts-ignore
    node.arguments[0].body.openingElement.attributes.unshift(
      estree.node("JSXAttribute", {
        name: estree.jsxIdentifier("key"),
        value: estree.node("JSXExpressionContainer", {
          expression: estree.stringLiteral("TODO: insert key"),
        }),
      }),
    );
  }
});
