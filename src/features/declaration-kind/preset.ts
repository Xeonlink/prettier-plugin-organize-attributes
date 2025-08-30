import type { VariableDeclaration } from "@/ast/estree";

export const PRESET: Record<string, (node: VariableDeclaration) => boolean> = {
  $ANY: () => true,
  $ANY_CONST: (node) => node.kind === "const",
  $ANY_LET: (node) => node.kind === "let",
  $ANY_VAR: (node) => node.kind === "var",
  $ANY_USING: (node) => node.kind === "using",
  $ANY_AWAIT_USING: (node) => node.kind === "await using",
  $HAS_REACT_HOOK: (node) => {
    return node.declarations.some((declarator) => {
      if (declarator.init?.type !== "CallExpression") return false;
      if (declarator.init.callee.type !== "Identifier") return false;
      if (!declarator.init.callee.name.startsWith("use")) return false;
      return true;
    });
  },
};
