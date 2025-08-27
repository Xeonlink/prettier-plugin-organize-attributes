import type { BaseNode, BaseExpression } from "estree-jsx";

declare module "estree-jsx" {
  interface ExpressionMap {
    StringLiteral: StringLiteral;
  }

  export interface StringLiteral extends BaseNode, BaseExpression {
    type: "StringLiteral";
    value: string;
    extra: {
      rawValue: string;
      raw: string;
    };
  }
}
