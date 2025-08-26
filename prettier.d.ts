import type { PluginConfig } from "./src/index";

declare module "prettier" {
  interface Config extends PluginConfig {}
  interface RequiredOptions extends PluginConfig {}
}
