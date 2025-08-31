import type { Options } from "./options";
import { PRESET } from "./preset";
import type { LowerFirst } from "./utils/type";

export const DEFAULT_GROUP = "$DEFAULT";

type GroupDef<T> = { type: "regex"; regex: RegExp; values: T[] } | { type: "default"; values: T[] };

function createEmptyGroupDefs<T>(
  groups: MiniOrganizeParams<T>["groups"],
  ignoreCase: MiniOrganizeParams<T>["ignoreCase"],
): GroupDef<T>[] {
  if (!groups.includes(DEFAULT_GROUP)) {
    groups.push(DEFAULT_GROUP);
  }

  return groups
    .map((group) => group.trim())
    .map((group) => PRESET.raw[group] ?? group)
    .flat()
    .map((group) => {
      if (group === DEFAULT_GROUP) {
        return {
          type: "default",
          values: [],
        };
      } else {
        return {
          type: "regex",
          regex: new RegExp(group, ignoreCase ? "i" : ""),
          values: [],
        };
      }
    });
}

function grouping<T>(groupDefs: GroupDef<T>[], attributes: T[], getKey: (node: T) => string) {
  let copied = [...attributes];
  const defaultGroupDef = groupDefs.find((group) => group.type === "default");
  for (const groupDef of groupDefs) {
    if (groupDef.type === "regex") {
      const groupValues = copied.filter((attribute) => groupDef.regex.test(getKey(attribute)));
      groupDef.values.push(...groupValues);
      copied = copied.filter((attribute) => !groupValues.includes(attribute));
    }
  }
  defaultGroupDef?.values.push(...copied);

  return groupDefs;
}

function trySorting<T>(groupDefs: GroupDef<T>[], sort: MiniOrganizeParams<T>["sort"], getKey: (node: T) => string) {
  if (sort !== "NONE") {
    for (const groupDef of groupDefs) {
      groupDef.values.sort((a, b) => {
        const aKey = getKey(a);
        const bKey = getKey(b);

        if (aKey < bKey) return -1;
        if (aKey > bKey) return 1;
        return 0;
      });
      if (sort === "DESC") groupDef.values.reverse();
    }
  }

  return groupDefs;
}

type MiniOrganizeParams<T> = {
  [key in keyof Options as key extends `attribute${infer K extends string}` ? LowerFirst<K> : never]: Options[key];
} & {
  getKey: (node: T) => string;
};

export function miniOrganize<T>(input: T[], options: MiniOrganizeParams<T>) {
  const { getKey, groups, ignoreCase, sort } = options;

  const groupDefs = createEmptyGroupDefs<T>(groups, ignoreCase);
  grouping(groupDefs, input, getKey);
  trySorting(groupDefs, sort, getKey);

  return groupDefs.flatMap((groupDef) => groupDef.values);
}
