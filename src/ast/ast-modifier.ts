import type { BuiltInParserName, Parser, ParserOptions, Plugin } from "prettier";

type NodeShape = { type: string | number };
type OptionsShape = Record<string, string | number | string[] | number[] | boolean>;
type Modifier<N extends NodeShape, O extends OptionsShape> = (node: N, options: O & ParserOptions<N>) => void;
type BuiltInParserNameAndElse = BuiltInParserName | (string & {});

export function defineAstModifier<N extends NodeShape, O extends OptionsShape>(
  astFormat: string,
  modifier: Modifier<N, O>,
) {
  return (parserName: BuiltInParserNameAndElse): Parser => {
    return {
      ...({} as Parser),
      parse: (text, options) => {
        const plugins = options.plugins as Plugin[];
        const parser = plugins
          .map((plugin) => plugin.parsers?.[parserName])
          .filter((parser) => parser !== undefined)
          .at(-2); // -1 is this parser
        if (!parser) {
          throw new Error(`Parser ${parserName} not found`);
        }
        const ast = parser.parse(text, options);
        modifier(ast, options as unknown as O & ParserOptions<N>);
        return ast;
      },
      astFormat,
    };
  };
}
