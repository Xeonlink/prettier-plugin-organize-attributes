import { createPlugin } from "./create";
import type { PluginOptions } from "./options";

const plugin = createPlugin();

export default plugin;

export const options = plugin.options;

export const parsers = plugin.parsers;

export type { PluginOptions as Config };

declare module "prettier" {
  interface RequiredOptions extends PluginOptions {}
  interface ParserOptions extends PluginOptions {}
}
