import { defineAstModifier } from "@/ast";
import type { Node } from "@/ast/estree";
import { convertFunction, estree } from "@/ast/estree";
import type { options } from "./options";
import { isJSXAttributeNoBrace, isJSXAttributeWithBrace } from "./target";

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { styleAttribute, styleAttributeBrace, styleAttributeFunction } = options;
  if (!["on"].includes(styleAttribute)) return;

  if (styleAttributeBrace !== "preserve") {
    if (node.type === "JSXAttribute") {
      const target = node;
      if (styleAttributeBrace === "force-brace") {
        if (isJSXAttributeNoBrace(target)) {
          node.value = estree.node("JSXExpressionContainer", {
            expression: target.value,
          });
        }
      }
      if (styleAttributeBrace === "force-no-brace") {
        if (isJSXAttributeWithBrace(target)) {
          node.value = target.value.expression;
        }
      }
    }
  }

  if (styleAttributeFunction !== "preserve") {
    if (node.type === "JSXAttribute") {
      if (node.value?.type === "JSXExpressionContainer") {
        if (styleAttributeFunction === "force-arrow-function") {
          if (node.value.expression.type === "FunctionExpression") {
            node.value.expression = convertFunction(node.value.expression).toArrowFunctionExpression();
          }
        }
        if (styleAttributeFunction === "force-function-expression") {
          if (node.value.expression.type === "ArrowFunctionExpression") {
            node.value.expression = convertFunction(node.value.expression).toFunctionExpression();
          }
        }
      }
    }
  }
});
