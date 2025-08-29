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

export type AstModifier = (parser: Parser) => Parser;

export function defineAstModifier<
  N extends { type: string | number },
  O extends Record<string, string | number | string[] | number[] | boolean>,
>(modifier: (node: N, options: O) => void) {
  return (parser: Parser): Parser => {
    return {
      ...parser,
      parse: (text, options) => {
        const ast = parser.parse(text, options);
        // @ts-expect-error
        travelAst<N>(ast, isNode, (node) => modifier(node, options));
        return ast;
      },
    };
  };
}
