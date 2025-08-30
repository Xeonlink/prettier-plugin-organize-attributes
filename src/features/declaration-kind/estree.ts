import { defineAstModifier } from "@/ast";
import type { Node } from "@/ast/estree";
import type { options } from "./options";
import { chunk } from "@/utils/utils";
import { PRESET } from "./preset";

type DeclarationKind = "var" | "let" | "const" | "using" | "await using";
const validKind = new Set<DeclarationKind>(["var", "let", "const", "using", "await using"]);

function isDeclarationKind(maybeKind: string): maybeKind is DeclarationKind {
  if (!maybeKind) return false;
  if (typeof maybeKind !== "string") return false;
  if (!validKind.has(maybeKind as any)) return false;
  return true;
}

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { declarationKind } = options;

  if (node.type === "VariableDeclaration") {
    if (declarationKind.length > 1) {
      const chunked = chunk(declarationKind, 2) //
        .map(([preset, kind]) => [PRESET[preset.replaceAll(" ", "")], kind.trim()] as const)
        .filter(([condition, kind]) => typeof condition === "function" && isDeclarationKind(kind));

      for (const [isCondition, kind] of chunked) {
        if (isCondition(node)) {
          node.kind = kind as DeclarationKind;
        }
      }
    }
  }
});
