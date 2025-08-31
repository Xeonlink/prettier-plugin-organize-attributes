import type { Parser, ParserOptions } from "prettier";

type NodeShape = { type: string | number };
type OptionsShape = Record<string, string | number | string[] | number[] | boolean>;
type Modifier<N extends NodeShape, O extends OptionsShape> = (node: N, options: O & ParserOptions<N>) => void;

export function defineAstModifier<N extends NodeShape, O extends OptionsShape>(modifier: Modifier<N, O>) {
  return (parser: Parser): Parser => {
    return {
      ...parser,
      parse: (text, options) => {
        const ast = parser.parse(text, options);
        modifier(ast, options as unknown as O & ParserOptions<N>);
        return ast;
      },
    };
  };
}
