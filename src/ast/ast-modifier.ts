import type { BuiltInParserName, Parser, ParserOptions, Plugin } from "prettier";

type NodeShape = { type: string | number };
type OptionsShape = Record<string, string | number | string[] | number[] | boolean>;
type Modifier<N extends NodeShape, O extends OptionsShape> = (node: N, options: O & ParserOptions<N>) => void;
type BuiltInParserNameAndElse = BuiltInParserName | (string & {});

function findLowerPriorityParser(plugins: Plugin[], parserName: BuiltInParserNameAndElse) {
  const parser = plugins
    .map((plugin) => plugin.parsers?.[parserName])
    .filter((parser) => parser !== undefined)
    .at(-2);

  if (!parser) {
    throw new Error(`Parser ${parserName} not found`);
  }

  return parser;
}

export function defineAstModifier<N extends NodeShape, O extends OptionsShape>(
  astFormat: string,
  modifier: Modifier<N, O>,
) {
  return (parserName: BuiltInParserNameAndElse) => {
    let lowerPriorityParser: Parser | undefined;

    // parserInitFunction
    return (): Parser => {
      return {
        locEnd: (node) => {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }

          return lowerPriorityParser.locEnd(node);
        },
        locStart(node) {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }

          return lowerPriorityParser.locStart(node);
        },
        hasPragma(text) {
          return lowerPriorityParser?.hasPragma?.(text) ?? false;
        },
        hasIgnorePragma(text) {
          return lowerPriorityParser?.hasIgnorePragma?.(text) ?? false;
        },
        preprocess(text, options) {
          if (!lowerPriorityParser) {
            const plugins = options.plugins as Plugin[];
            const parser = findLowerPriorityParser(plugins, parserName);
            lowerPriorityParser = parser;
          }

          const preprocessed = lowerPriorityParser.preprocess?.(text, options) ?? text;
          return preprocessed;
        },
        async parse(text, options) {
          if (!lowerPriorityParser) {
            const plugins = options.plugins as Plugin[];
            const parser = findLowerPriorityParser(plugins, parserName);
            lowerPriorityParser = parser;
          }

          const ast = await lowerPriorityParser.parse(text, options);
          modifier(ast, options as unknown as O & ParserOptions<N>);
          return ast;
        },
        astFormat,
      };
    };
  };
}
