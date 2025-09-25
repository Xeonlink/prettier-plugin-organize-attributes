import type { SupportOption, SupportOptions } from "prettier";
import type { UpperAlphabet } from "./utils/type";

type InferOptionType<T extends SupportOption> = {
  boolean: T extends { type: "boolean" } ? boolean : never;
  choice: T extends { type: "choice" } ? T["choices"][number]["value"] : never;
  int: T extends { type: "int" } ? number : never;
  path: T extends { type: "path" } ? string : never;
  string: T extends { type: "string" } ? string : never;
}[T["type"]];

type InferOption<T extends SupportOption> =
  | (T extends { default?: any } ? never : undefined)
  | (T extends { array: true } ? Array<InferOptionType<T>> : InferOptionType<T>);

type InferOptions<T extends Record<`attribute${UpperAlphabet}${string}`, SupportOption>> =
  T extends Record<infer O, SupportOption> ? { [key in O]: InferOption<T[key]> } : never;

const defineOptions = <const T extends SupportOptions>(options: T) => options;

export const options = defineOptions({
  attributeGroups: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide an order to organize HTML attributes into groups.",
  },
  attributeSort: {
    type: "choice",
    category: "Global",
    default: "NONE",
    choices: [
      { value: "NONE", description: "No sorting." },
      { value: "ASC", description: "Sort attributes in ascending order." },
      { value: "DESC", description: "Sort attributes in descending order." },
    ],
    description: "attributeSort HTML attribute groups internally. ASC, DESC or NONE.",
  },
  attributeIgnoreCase: {
    type: "boolean",
    category: "Global",
    array: false,
    default: true,
    description: "A flag to ignore casing in regexps or not.",
  },
});

export type PluginOptions = InferOptions<typeof options>;
