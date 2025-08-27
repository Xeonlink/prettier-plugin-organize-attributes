import type { CoreCategoryType, SupportOption, SupportOptions } from "prettier";
import type { Prettify } from "./type";
import { pick } from "@/utils/utils";

type InferSupportOptionType<T extends SupportOption> = T extends { type: "string" }
  ? string
  : T extends { type: "boolean" }
    ? boolean
    : T extends { type: "number" }
      ? number
      : T extends { type: "choice" }
        ? T["choices"][number]["value"]
        : never;

type InferSupportOptionIsArray<T extends SupportOption> = T extends { array: true }
  ? Array<InferSupportOptionType<T>>
  : InferSupportOptionType<T>;

type InferSupportOptionHasDefault<T extends SupportOption> = T extends {
  default?: any;
}
  ? InferSupportOptionIsArray<T>
  : InferSupportOptionIsArray<T> | undefined;

type InferSupportOptions<T extends SupportOptions> =
  T extends Record<infer O, SupportOption> ? { [key in O]: InferSupportOptionHasDefault<T[key]> } : never;

export type OptionsDefinition<O extends Record<string, SupportOption>> = {
  raw: O;
  infer: Prettify<InferSupportOptions<O>>;
  parse: (options: any) => InferSupportOptions<O>;
};

export function defineOptions<const O extends Record<K, SupportOption>, K extends string>(
  definition: O,
): OptionsDefinition<O> {
  const parse = (options: any) => {
    if (typeof options !== "object") {
      throw new Error("Options must be an object");
    }
    if (options === null) {
      throw new Error("Options must not be null");
    }

    return pick(options, ...Object.keys(definition)) as InferSupportOptions<O>;
  };

  return {
    raw: definition,
    infer: null as unknown as InferSupportOptions<O>,
    parse,
  };
}
