import { defineAstModifier } from "@/ast";
import { estree, getJSXAttributeKey, getJSXOpeningElementTagName, type Node } from "@/ast/estree";
import { chunk, regex } from "@/utils/utils";
import { options } from "./options";
import { PRESET } from "./preset";

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { insertAttribute, insertAttributeMap } = options;
  if (!["on", "estree"].includes(insertAttribute)) return;

  if (node.type === "JSXOpeningElement") {
    const tagName = getJSXOpeningElementTagName(node);
    const keys = node.attributes.filter((attribute) => attribute.type === "JSXAttribute").map(getJSXAttributeKey);
    const chunked = chunk(insertAttributeMap, 2)
      .map((entry) => [entry[0].trim(), entry[1].replace(" ", "")])
      .filter((entry) => entry.every(Boolean))
      .map((entry) => [PRESET[entry[0].replace(" ", "")] ?? entry[0], entry[1]])
      .map((entry) => [regex(entry[0]), entry[1]] as const);

    for (const [tagRegExp, attributeKeyName] of chunked) {
      if (!tagRegExp.test(tagName)) continue;
      if (keys.includes(attributeKeyName)) continue;

      node.attributes.push(
        estree.node("JSXAttribute", {
          name: estree.jsxIdentifier(attributeKeyName),
          value: estree.node("JSXExpressionContainer", {
            expression: estree.stringLiteral("TODO: fill value"),
          }),
        }),
      );
      keys.push(attributeKeyName);
    }
  }
});
