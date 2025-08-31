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
    // .js/.jsx
    babel: withEstreeParser(babelParsers.babel),
    // .ts/.tsx
    typescript: withEstreeParser(typescriptParsers.typescript),
    // .html
    html: withHtmlParser(htmlParsers.html),
    // .vue
    vue: withHtmlParser(htmlParsers.vue),
    // .component.html
    angular: withHtmlParser(htmlParsers.angular),
  },
};

export default plugin;

export type { Options as Config };

declare module "prettier" {
  interface Config extends Options {}
}
