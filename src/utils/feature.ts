import type { BuiltInParserName, Parser, SupportOption } from "prettier";
import type { OptionsDefinition } from "./options";

export type FeatureDefinition<
  O extends Record<K, SupportOption> = Record<string, SupportOption>,
  K extends string = string,
> = {
  options: OptionsDefinition<O>;
  parsers: (parsers: Record<BuiltInParserName | (string & {}), Parser>) => Record<string, Parser>;
};

export function defineFeature<O extends Record<K, SupportOption>, K extends string>(
  definition: FeatureDefinition<O, K>,
) {
  return definition;
}
