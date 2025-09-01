import type { Plugin } from "prettier";
import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as htmlParsers } from "prettier/plugins/html";
import { parsers as typescriptParsers } from "prettier/plugins/typescript";
import { withEstreeParser } from "./estree";
import { withHtmlParser } from "./html";
import type { Options } from "./options";
import { options } from "./options";

const plugin: Plugin = {
  options: options,
  parsers: {
    babel: withEstreeParser(babelParsers.babel),
    typescript: withEstreeParser(typescriptParsers.typescript),
    html: withHtmlParser(htmlParsers.html),
    vue: withHtmlParser(htmlParsers.vue),
    angular: withHtmlParser(htmlParsers.angular),
    lwc: withHtmlParser(htmlParsers.lwc),
    mjml: withHtmlParser(htmlParsers.mjml),
  },
};

export default plugin;

export type { Options as Config };

declare module "prettier" {
  interface Config extends Options {}
}
