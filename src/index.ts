import type { Parser, Plugin } from "prettier";
import { createEstreeParser } from "./estree";
import { createHtmlParser } from "./html";
import type { Options } from "./options";
import { options } from "./options";
import { createSveltParser } from "./svelt";

type BetterPlugin = Omit<Plugin, "parsers"> & {
  parsers: Record<string, Parser | (() => Parser)>;
};

const plugin: BetterPlugin = {
  options: options,
  parsers: {
    babel: createEstreeParser("babel"),
    typescript: createEstreeParser("typescript"),
    html: createHtmlParser("html"),
    vue: createHtmlParser("vue"),
    angular: createHtmlParser("angular"),
    lwc: createHtmlParser("lwc"),
    mjml: createHtmlParser("mjml"),
    svelte: createSveltParser("svelte"),
  },
};

export default plugin;

export type { Options as Config };

declare module "prettier" {
  interface Config extends Options {}
}
