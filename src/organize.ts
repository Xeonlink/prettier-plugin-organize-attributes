import type { Options } from "./options";
import { PRESET } from "./preset";

export const DFEAULT_PRESET = "$DEFAULT";

export type GroupDef<T extends { type: string }> =
  | { type: "regex"; regex: RegExp; values: T[] }
  | { type: "default"; values: T[] };

export function createEmptyGroupDefs<T extends { type: string }>(param: {
  attributeGroups: string[];
  attributeIgnoreCase: boolean;
}): GroupDef<T>[] {
  if (!param.attributeGroups.includes(DFEAULT_PRESET)) {
    param.attributeGroups.push(DFEAULT_PRESET);
  }

  return param.attributeGroups
    .map((group) => group.trim())
    .map((group) => PRESET.raw[group] ?? group)
    .flat()
    .map((group) => {
      if (group === DFEAULT_PRESET) {
        return {
          type: "default",
          values: [],
        };
      } else {
        return {
          type: "regex",
          regex: new RegExp(group, param.attributeIgnoreCase ? "i" : ""),
          values: [],
        };
      }
    });
}

export function grouping<T extends { type: string }>(
  groupDefs: GroupDef<T>[],
  attributes: T[],
  getKey: (node: T) => string,
) {
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

export function trySorting<T extends { type: string }>(
  groupDefs: GroupDef<T>[],
  sort: Options["attributeSort"],
  getKey: (node: T) => string,
) {
  if (sort !== "NONE") {
    for (const groupDef of groupDefs) {
      groupDef.values.sort((a, b) => getKey(a).localeCompare(getKey(b)));
      if (sort === "DESC") groupDef.values.reverse();
    }
  }

  return groupDefs;
}

export function clearGroupDefs<T extends { type: string }>(groupDefs: GroupDef<T>[]) {
  for (const groupDef of groupDefs) {
    groupDef.values = [];
  }
}
