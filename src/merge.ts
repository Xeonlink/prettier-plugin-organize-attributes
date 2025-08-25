import prettier from "prettier";
import htmlParsers from "prettier/parser-html";
import type { Parser, Plugin } from "prettier";

function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}

function picker<T, K extends keyof T>(...keys: K[]): (obj: T) => Pick<T, K> {
  return (obj: T) => pick(obj, ...keys);
}

function deepCopy(value: any): any {
  switch (typeof value) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "undefined":
    case "symbol":
      return value;
    case "function":
      return (...args: any[]) => value(...args);
    case "object":
      if (value === null) return null;
      if (value instanceof Date) return new Date(value.getTime());
      if (value instanceof RegExp) return new RegExp(value.source, value.flags);
      if (Array.isArray(value)) return value.map((item) => deepCopy(item));

      const result: any = {};
      for (const key in value) {
        result[key] = deepCopy(value[key]);
      }
      return result;
  }
}

function deepCopyDepthOne(value: any): any {
  const result: any = {};
  for (const key in value) {
    if (typeof value[key] === "object" || typeof value[key] === "function") {
      continue;
    }
    result[key] = value[key];
  }

  return result;
}

const builtInOptionKeys: string[] = [
  "printWidth",
  "tabWidth",
  "useTabs",
  "semi",
  "singleQuote",
  "quoteProps",
  "jsxSingleQuote",
  "trailingComma",
  "bracketSpacing",
  "objectWrap",
  // "jsxBracketSameLine",
  "bracketSameLine",
  "arrowParens",
  // "rangeStart",
  // "rangeEnd",
  // "parser",
  "filepath",
  "requirePragma",
  "insertPragma",
  "checkIgnorePragma",
  "proseWrap",
  "htmlWhitespaceSensitivity",
  "vueIndentScriptAndStyle",
  "endOfLine",
  "embeddedLanguageFormatting",
  "singleAttributePerLine",
];

function isThisPlugin(target: string | URL | prettier.Plugin<any>): target is ThisPlugin {
  if (typeof target !== "object") return false;
  if (target === null) return false;
  if (!("name" in target)) return false;
  if (typeof target.name !== "string") return false;
  if (target.name !== plugin.name) return false;
  return true;
}

function proxyParsers<T extends Record<string, Parser>>(actualProp: string, parsers: T) {
  return new Proxy(parsers, {
    has: () => true,
    get(target, prop, receiver) {
      if (prop === "hasOwnProperty") {
        return () => true;
      }
      return target[actualProp];
    },
    getOwnPropertyDescriptor: (target, prop) => {
      return {
        value: target[actualProp],
        writable: true,
        enumerable: true,
        configurable: true,
      };
    },
  });
}

interface ThisPlugin extends Plugin<string> {
  name: string;
}

const plugin: ThisPlugin = {
  name: "prettier-plugin-merge",
  parsers: proxyParsers("all", {
    all: {
      ...htmlParsers.parsers.html,
      astFormat: "all",
      parse: async (text, options) => {
        const [builtInPlugin, ...plugins] = options.plugins;

        let formattedText = text;
        for (const plugin of plugins) {
          if (isThisPlugin(plugin)) continue;

          const pluginOptionKeys = ([plugin] as prettier.Plugin[])
            .map((plugin) => plugin.options)
            .filter((options) => typeof options === "object" && options !== null)
            .map((options) => Object.keys(options))
            .flat();

          const pickedOptions = pick(options, ...builtInOptionKeys, ...pluginOptionKeys);
          pickedOptions.plugins = [builtInPlugin, plugin];
          const copiedOptions = deepCopy(pickedOptions);
          formattedText = await prettier.format(formattedText, copiedOptions);
        }

        return formattedText;
      },
    },
  }),
  printers: {
    all: {
      print: (path, options, print) => {
        return path.node;
      },
    },
  },
};

export default plugin;
