import type { SupportOption, SupportOptions } from "prettier";

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

type InferSupportOptionHasDefault<T extends SupportOption> = T["default"] extends undefined
  ? InferSupportOptionIsArray<T> | undefined
  : InferSupportOptionIsArray<T>;

export type InferSupportOptions<T extends SupportOptions> =
  T extends Record<infer O, SupportOption> ? { [key in O]: InferSupportOptionHasDefault<T[key]> } : never;
