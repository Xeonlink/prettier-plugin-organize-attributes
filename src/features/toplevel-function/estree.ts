import { type AstModifier } from "@/ast";
import { convertFunction, estree, type Program } from "@/ast/estree";
import type { options } from "./options";
import { isExportDefaultFunctionShape, isExportExpressionFnShape, isExportVarFnShape, isVarFnShape } from "./target";
import { iter } from "@/utils/utils";

export const withEstreeModifier: AstModifier = (parser) => ({
  ...parser,
  parse: (text: string, rawOptions) => {
    const { toplevelFunction } = rawOptions as unknown as typeof options.infer;
    const program = parser.parse(text, rawOptions) as Program;

    if (toplevelFunction === "force-arrow-function") {
      for (const [i, item] of iter(program.body)) {
        switch (item.type) {
          case "ExportDefaultDeclaration":
            if (isExportDefaultFunctionShape(item)) {
              item.declaration = convertFunction(item.declaration).toArrowFunctionExpression();
            }
            break;
          case "ExportNamedDeclaration":
            const target = item;
            if (isExportExpressionFnShape(target)) {
              const { range, loc } = target.declaration;
              item.declaration = estree.node("VariableDeclaration", {
                kind: "const",
                declarations: [
                  estree.node("VariableDeclarator", {
                    id: target.declaration.id,
                    init: convertFunction(target.declaration).toArrowFunctionExpression(),
                    loc,
                    range,
                  }),
                ],
                loc,
                range,
              });
              // item.declaration = estree.declareVariables("const", [
              //   estree.node("VariableDeclarator", {
              //     id: target.declaration.id,
              //     init: convertFunction(target.declaration).toArrowFunctionExpression(),
              //   }),
              // ]);
            }
            break;
          case "FunctionDeclaration":
            const { range, loc } = program.body[i];
            program.body[i] = estree.node("VariableDeclaration", {
              kind: "const",
              declarations: [
                estree.node("VariableDeclarator", {
                  id: item.id,
                  init: convertFunction(item).toArrowFunctionExpression(),
                  loc,
                  range,
                }),
              ],
              loc,
              range,
            });
            // program.body[i] = estree.declareVariables("const", [
            //   estree.node("VariableDeclarator", {
            //     id: item.id,
            //     init: convertFunction(item).toArrowFunctionExpression(),
            //   }),
            // ]);
            break;
          case "ExpressionStatement":
            if (item.expression.type === "FunctionExpression") {
              item.expression = convertFunction(item.expression).toArrowFunctionExpression();
            }
            break;
        }
      }
    } else if (toplevelFunction === "force-function-keyword") {
      for (const [i, item] of iter(program.body)) {
        switch (item.type) {
          case "ExportDefaultDeclaration":
            if (isExportDefaultFunctionShape(item)) {
              item.declaration = convertFunction(item.declaration).toMaybeNamedFunctionDeclaration();
            }
            break;
          case "ExportNamedDeclaration":
            const target = item;
            if (isExportVarFnShape(item)) {
              const { id, init: fnBase } = item.declaration.declarations[0];
              target.declaration = convertFunction(fnBase).toFunctionDeclaration(id);
            }
            break;
          case "VariableDeclaration":
            if (isVarFnShape(item)) {
              const { id, init: fnBase } = item.declarations[0];
              program.body[i] = convertFunction(fnBase).toFunctionDeclaration(id);
            }
            break;
          case "ExpressionStatement":
            if (item.expression.type === "ArrowFunctionExpression") {
              item.expression = convertFunction(item.expression).toFunctionExpression();
            }
            break;
        }
      }
    }

    return program;
  },
});
