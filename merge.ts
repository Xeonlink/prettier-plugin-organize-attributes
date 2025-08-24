import prettier from "prettier";
import htmlParsers from "prettier/parser-html";
import type { Parser, Plugin } from "prettier";

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
        const plugins = [...options.plugins];
        const builtInPlugin = plugins.shift()!;
        options.plugins = [];

        let formattedText = text;
        for (const plugin of plugins) {
          if (isThisPlugin(plugin)) continue;
          options.plugins = [builtInPlugin, plugin];

          console.log(options)
          formattedText = await prettier.format(formattedText, options);
          options.originalText = formattedText;
          console.log(options)
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