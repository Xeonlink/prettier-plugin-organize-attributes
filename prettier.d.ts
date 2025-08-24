import type { PluginConfig as SortAttributesPluginConfig } from "./dist/src/index.d.ts";
import type { PluginConfig as SimpleImportPluginConfig } from "@trivago/prettier-plugin-sort-imports";

declare module "prettier" {
  // interface Config
  //   extends SimpleImportPluginConfig,
  //     SortAttributesPluginConfig {
  //   vueExcludeBlocks: string[];
  // }
  // interface RequiredOptions
  //   extends SimpleImportPluginConfig,
  //     SortAttributesPluginConfig {
  //   vueExcludeBlocks: string[];
  // }
}
