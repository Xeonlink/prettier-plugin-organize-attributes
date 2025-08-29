import { type AstModifier } from "@/ast";
import { convertFunction, estree, expression2BlockStatement, type Program } from "@/ast/estree";
import type { options } from "./options";
import { isTarget0, isTarget1, isTarget2, isTarget4, isTarget5 } from "./target";

export const withEstreeModifier: AstModifier = (parser) => ({
  ...parser,
  parse: (text: string, rawOptions) => {
    const { toplevelFunction } = rawOptions as unknown as typeof options.infer;
    const program = parser.parse(text, rawOptions) as Program;

    if (toplevelFunction === "force-arrow-function") {
      for (let i = 0; i < program.body.length; i++) {
        const item = program.body[i];
        if (item.type === "ExportDefaultDeclaration") {
          const target = item;
          if (isTarget1(target)) {
            // item.declaration = convertFunction(target.declaration).toArrowFunctionExpression();
            item.declaration = estree.node("ArrowFunctionExpression", {
              body: target.declaration.body,
              expression: false,
              params: target.declaration.params,
              async: target.declaration.async,
              generator: target.declaration.generator,
            });
          }
        } else if (item.type === "ExportNamedDeclaration") {
          const target = item;
          if (isTarget2(target)) {
            // item.declaration = estree.declareVariables("const", [
            //   estree.node("VariableDeclarator", {
            //     id: target.declaration.id,
            //     init: convertFunction(target.declaration).toArrowFunctionExpression(),
            //   }),
            // ]);
            item.declaration = estree.arrowFunctionDeclaration("const", {
              id: target.declaration.id,
              body: target.declaration.body,
              expression: false,
              params: target.declaration.params,
              async: target.declaration.async,
              generator: target.declaration.generator,
            });
          }
        } else if (item.type === "FunctionDeclaration") {
          program.body[i] = estree.arrowFunctionDeclaration("const", {
            id: item.id,
            body: item.body,
            expression: false,
            params: item.params,
            async: item.async,
            generator: item.generator,
          });
        }
      }
    } else if (toplevelFunction === "force-function-declaration") {
      for (let i = 0; i < program.body.length; i++) {
        const item = program.body[i];
        if (item.type === "ExportDefaultDeclaration") {
          const target = item;
          if (isTarget0(target)) {
            item.declaration = estree.node("FunctionExpression", {
              id: null,
              body:
                target.declaration.body.type === "BlockStatement"
                  ? target.declaration.body
                  : expression2BlockStatement(target.declaration),
              params: target.declaration.params,
              async: target.declaration.async,
              generator: target.declaration.generator,
            });
          }
        } else if (item.type === "ExportNamedDeclaration") {
          const target = item;
          if (isTarget4(item)) {
            target.declaration = estree.node("FunctionDeclaration", {
              id: item.declaration.declarations[0].id,
              body:
                item.declaration.declarations[0].init.body.type === "BlockStatement"
                  ? item.declaration.declarations[0].init.body
                  : expression2BlockStatement(item.declaration.declarations[0].init),
              params: item.declaration.declarations[0].init.params,
              async: item.declaration.declarations[0].init.async,
              generator: item.declaration.declarations[0].init.generator,
            });
          }
        } else if (item.type === "VariableDeclaration") {
          const target = item;
          if (isTarget5(target)) {
            program.body[i] = estree.node("FunctionDeclaration", {
              id: target.declarations[0].id,
              body:
                target.declarations[0].init.body.type === "BlockStatement"
                  ? target.declarations[0].init.body
                  : expression2BlockStatement(target.declarations[0].init),
              params: target.declarations[0].init.params,
              async: target.declarations[0].init.async,
              generator: target.declarations[0].init.generator,
            });
          }
        }
      }
    }

    return program;
  },
});
