import type { Plugin } from "prettier";
import { features } from "./features";
import { builtInParsers } from "./builtin-parsers";
import type { Prettify, UnionToIntersection } from "@/utils/type";

const builtInParserArray = Object.values(builtInParsers);

const options = features //
  .map((feature) => feature.options.raw)
  .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const parsers = features //
  .map((feature) => feature.parsers)
  .reduce((pre, cur) => ({ ...pre, ...cur(pre) }), builtInParsers);

const filteredParsers = Object.fromEntries(
  Object.entries(parsers).filter(([_, value]) => !builtInParserArray.includes(value)),
);

const plugin: Plugin = {
  options: options,
  parsers: filteredParsers,
};

export default plugin;

type PluginConfig = Prettify<UnionToIntersection<(typeof features)[number]["options"]["infer"]>>;

export type { PluginConfig };
