import type { Node } from "../../ast/estree";
import { defineAstModifier } from "../../utils/ast-modifier";
import { options } from "./options";

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { insertJsxKey } = options;
  if (!["on"].includes(insertJsxKey)) return;

  if (node.type === "JSXElement") {
  }
});
