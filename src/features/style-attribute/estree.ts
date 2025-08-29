import { defineAstModifier } from "@/ast";
import type { Node } from "@/ast/estree";
import { estree, expression2BlockStatement } from "@/ast/estree";
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
          const literal = target.value;
          node.value = estree.node("JSXExpressionContainer", {
            expression: literal,
          });
        }
      }
      if (styleAttributeBrace === "force-no-brace") {
        if (isJSXAttributeWithBrace(target)) {
          const literal = target.value.expression;
          node.value = literal;
        }
      }
    }
  }

  if (styleAttributeFunction !== "preserve") {
    if (node.type === "JSXAttribute") {
      if (node.value?.type === "JSXExpressionContainer") {
        if (styleAttributeFunction === "force-arrow-function") {
          if (node.value.expression.type === "FunctionExpression") {
            const body = node.value.expression.body;
            const params = node.value.expression.params;
            node.value.expression = estree.node("ArrowFunctionExpression", {
              body,
              params,
              expression: false,
            });
          }
        }
        if (styleAttributeFunction === "force-function-expression") {
          if (node.value.expression.type === "ArrowFunctionExpression") {
            const { body, ...rest } = node.value.expression;
            if (body.type === "BlockStatement") {
              node.value.expression = estree.node("FunctionExpression", {
                ...rest,
                body,
              });
            } else {
              node.value.expression = estree.node("FunctionExpression", {
                ...rest,
                body: expression2BlockStatement(body),
              });
            }
          }
        }
      }
    }
  }
});
