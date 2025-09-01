import type { Plugin } from "prettier";
import { withEstreeParser } from "./estree";
import { withHtmlParser } from "./html";
import type { Options } from "./options";
import { options } from "./options";

const plugin: Plugin = {
  options: options,
  parsers: {
    babel: withEstreeParser("babel"),
    typescript: withEstreeParser("typescript"),
    html: withHtmlParser("html"),
    vue: withHtmlParser("vue"),
    angular: withHtmlParser("angular"),
    lwc: withHtmlParser("lwc"),
    mjml: withHtmlParser("mjml"),
  },
};

export default plugin;

export type { Options as Config };

declare module "prettier" {
  interface Config extends Options {}
}
