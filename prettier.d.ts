import type { PluginConfig as SimpleImportPluginConfig } from "@trivago/prettier-plugin-sort-imports";

declare module "prettier" {
  interface Config extends SimpleImportPluginConfig {}
}
