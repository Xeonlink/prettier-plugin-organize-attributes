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

type NodeShape = { type: string | number };
type OptionsShape = Record<string, string | number | string[] | number[] | boolean>;

export interface AstTraveler<N extends NodeShape, O extends OptionsShape> {
  canTravel: (options: O) => boolean;
  travel: (node: N, options: O) => void;
}

type Modifier<N extends NodeShape, O extends OptionsShape> = (node: N, options: O) => void;

export function defineAstModifier<N extends NodeShape, O extends OptionsShape>(modifier: Modifier<N, O>) {
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
