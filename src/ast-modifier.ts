import type { PluginOptions } from "./options";
import { parseOptions } from "./options";
import type { Parser } from "prettier";

function travelAst<N extends object>(node: N, filter: (value: unknown) => value is N, callback: (node: N) => void) {
  callback(node);

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (filter(item)) {
          travelAst(item, filter, callback);
        }
      }
      continue;
    }
    if (filter(value)) {
      travelAst(value, filter, callback);
      continue;
    }
  }
}

function isNode<T>(unknown: unknown): unknown is T {
  if (typeof unknown !== "object") return false;
  if (unknown === null) return false;
  if (!("type" in unknown)) return false;
  if (typeof unknown.type !== "string") return false;
  return true;
}

export function defineAstModifier<N extends { type: string | number }>(
  modifier: (node: N, options: PluginOptions) => void,
) {
  return (parser: Parser): Parser => {
    return {
      ...parser,
      parse: (text, options) => {
        const parsedOptions = parseOptions(options);
        const ast = parser.parse(text, options);
        travelAst<N>(ast, isNode, (node) => modifier(node, parsedOptions));
        return ast;
      },
    };
  };
}
