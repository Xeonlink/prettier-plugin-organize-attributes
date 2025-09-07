import type { Parser, Plugin } from "prettier";
import { createAstroParser } from "./astro";
import { createEstreeParser } from "./estree";
import { createHtmlParser } from "./html";
import { options as optionsBase } from "./options";
import { createSvelteParser } from "./svelte";

type BetterPlugin = Omit<Plugin, "parsers"> & {
  parsers: Record<string, Parser | (() => Parser | Promise<Parser>)>;
};

export function createPlugin(): BetterPlugin {
  return {
    options: optionsBase,
    parsers: {
      babel: createEstreeParser("babel"),
      typescript: createEstreeParser("typescript"),
      html: createHtmlParser("html"),
      vue: createHtmlParser("vue"),
      angular: createHtmlParser("angular"),
      lwc: createHtmlParser("lwc"),
      mjml: createHtmlParser("mjml"),
      svelte: createSvelteParser("svelte"),
      astro: createAstroParser("astro"),
    },
  };
}
