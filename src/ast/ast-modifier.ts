import { isPromise } from "util/types";
import type { BuiltInParserName, Parser, ParserOptions, Plugin } from "prettier";

type NodeShape = { type: string | number };
type OptionsShape = Record<string, string | number | string[] | number[] | boolean>;
type Modifier<N extends NodeShape, O extends OptionsShape> = (node: N, options: O & ParserOptions<N>) => void;
type BuiltInParserNameAndElse = BuiltInParserName | (string & {});

function findLowerPriorityParser(
  plugins: Plugin[],
  parserName: BuiltInParserNameAndElse,
): Parser | (() => Parser | Promise<Parser>) {
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
    let lowerPriorityParser: Parser | Promise<Parser> | (() => Parser | Promise<Parser>) | undefined;

    // parserInitFunction
    return (): Parser => {
      return {
        locEnd: (node) => {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          if (typeof lowerPriorityParser === "function") {
            lowerPriorityParser = lowerPriorityParser();
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          return lowerPriorityParser.locEnd(node);
        },
        locStart(node) {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          if (typeof lowerPriorityParser === "function") {
            lowerPriorityParser = lowerPriorityParser();
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }

          return lowerPriorityParser.locStart(node);
        },
        hasPragma(text) {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          if (typeof lowerPriorityParser === "function") {
            lowerPriorityParser = lowerPriorityParser();
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }

          return lowerPriorityParser.hasPragma?.(text) ?? false;
        },
        hasIgnorePragma(text) {
          if (!lowerPriorityParser) {
            throw new Error("Lower priority parser not found");
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          if (typeof lowerPriorityParser === "function") {
            lowerPriorityParser = lowerPriorityParser();
          }
          if (isPromise(lowerPriorityParser)) {
            throw new Error("Lower priority parser is a promise");
          }
          return lowerPriorityParser.hasIgnorePragma?.(text) ?? false;
        },
        async parse(originalText, options) {
          if (!lowerPriorityParser) {
            const plugins = options.plugins as Plugin[];
            lowerPriorityParser = findLowerPriorityParser(plugins, parserName);
          }
          if (typeof lowerPriorityParser === "function") {
            lowerPriorityParser = lowerPriorityParser();
          }
          if (isPromise(lowerPriorityParser)) {
            lowerPriorityParser = await lowerPriorityParser;
          }

          const preprocessor = lowerPriorityParser.preprocess ?? ((text, _) => text);
          const text = preprocessor(originalText, options);
          options.originalText = text;

          const ast = await lowerPriorityParser.parse(text, options);

          modifier(ast, options as unknown as O & ParserOptions<N>);
          return ast;
        },
        astFormat,
      };
    };
  };
}
