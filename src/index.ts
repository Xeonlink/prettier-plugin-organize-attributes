import { createPlugin } from "./create";
import type { Options } from "./options";

const plugin = createPlugin();

export default plugin;

export const options = plugin.options;

export const parsers = plugin.parsers;

export type { Options as Config };
