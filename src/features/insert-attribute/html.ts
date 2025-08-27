import { defineAstModifier } from "@/ast";
import { html, type Node } from "@/ast/html";
import { options } from "./options";
import { chunk, regex } from "@/utils/utils";

export const withHtmlModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { insertAttribute, insertAttributeMap } = options;
  if (!["on", "html"].includes(insertAttribute)) return;

  if (node.type === "element") {
    const tagName = node.name;
    const keys = node.attrs.map((attr) => attr.name);
    const chunked = chunk(insertAttributeMap, 2)
      .map((entry) => [entry[0].trim(), entry[1].replace(" ", "")])
      .filter((entry) => entry.every(Boolean))
      .map((entry) => [regex(entry[0]), entry[1]] as const);

    for (const [tagRegExp, attributeKeyName] of chunked) {
      if (!tagRegExp.test(tagName)) continue;
      if (keys.includes(attributeKeyName)) continue;

      node.attrs.push(
        html.node("attribute", {
          name: attributeKeyName,
          value: "TODO: fill value",
        }),
      );
      keys.push(attributeKeyName);
    }
  }
});
