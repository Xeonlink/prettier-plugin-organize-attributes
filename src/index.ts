import { withEstreeModifier } from "./ast/estree";
import { withHtmlModifier } from "./ast/html";
import type { PluginConfig } from "./options";
import { supportOptions } from "./options";
import type { Plugin } from "prettier";
import babelParsers from "prettier/parser-babel";
import htmlParsers from "prettier/parser-html";
import tsParsers from "prettier/parser-typescript";

const parsers = {
  ...babelParsers.parsers,
  ...htmlParsers.parsers,
  ...tsParsers.parsers,
};

const plugin: Plugin = {
  options: supportOptions,
  parsers: {
    // jsx
    babel: withEstreeModifier(parsers.babel),
    // tsx
    typescript: withEstreeModifier(parsers.typescript),
    // html
    html: withHtmlModifier(parsers.html),
    // vue
    vue: withHtmlModifier(parsers.vue),
    // angular
    angular: withHtmlModifier(parsers.angular),
  },
};

export default plugin;

export type { PluginConfig };
