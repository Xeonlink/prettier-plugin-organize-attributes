import { defineAstModifier } from "@/ast";
import { html, type Node } from "@/ast/html";
import { chunk, memoize, regex } from "@/utils/utils";
import { options } from "./options";
import { PRESET } from "./preset";

const mapChunks = memoize((insertAttributeMap: string[]) => {
  return chunk(insertAttributeMap, 2)
    .map((entry) => [entry[0].trim(), entry[1].replaceAll(" ", "")])
    .filter((entry) => entry.every(Boolean))
    .map((entry) => [PRESET[entry[0].replaceAll(" ", "")] ?? entry[0], entry[1]])
    .map((entry) => [regex(entry[0]), entry[1]] as const);
});

export const withHtmlModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { insertAttribute, insertAttributeMap } = options;
  if (!["on", "html"].includes(insertAttribute)) return;

  if (node.type === "element") {
    const tagName = node.name;
    const keys = node.attrs.map((attr) => attr.name);
    const chunked = mapChunks(insertAttributeMap);

    for (const [tagRegExp, attributeKeyName] of chunked) {
      if (!tagRegExp.test(tagName)) continue;
      if (keys.includes(attributeKeyName)) continue;

      node.attrs.push(html.attribute(attributeKeyName, "TODO: fill value"));
      keys.push(attributeKeyName);
    }
  }
});
