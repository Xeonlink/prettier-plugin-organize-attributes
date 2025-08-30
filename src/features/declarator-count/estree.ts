import { defineAstModifier } from "@/ast";
import { estree, type Node } from "@/ast/estree";
import type { options } from "./options";
import { iter, chunk } from "@/utils/utils";
import type { Statement } from "estree";

function processStatementArray(statements: Statement[], maxDeclaratorInline: number) {
  for (const [i, statement] of iter(statements)) {
    if (statement.type === "VariableDeclaration") {
      if (statement.declarations.length > maxDeclaratorInline) {
        const newDeclarations = chunk(statement.declarations, maxDeclaratorInline).map((declarators) => {
          return estree.node("VariableDeclaration", {
            kind: statement.kind,
            declarations: declarators,
            loc: statement.loc,
            range: statement.range,
          });
        });
        newDeclarations[0].leadingComments = statement.leadingComments;
        newDeclarations[newDeclarations.length - 1].trailingComments = statement.trailingComments;
        statements.splice(i, 1, ...newDeclarations);
      }
    }
  }
}

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { maxDeclaratorInline } = options;

  if (maxDeclaratorInline > 0) {
    if (node.type === "BlockStatement") {
      processStatementArray(node.body, maxDeclaratorInline);
    } else if (node.type === "Program") {
      processStatementArray(node.body as Statement[], maxDeclaratorInline);
    } else if (node.type === "SwitchCase") {
      processStatementArray(node.consequent, maxDeclaratorInline);
    }
  }
});
