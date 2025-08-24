import { PRESET } from "./preset";
import type { SupportOptions } from "prettier";

export const supportOptions = {
  attributeGroups: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide an order to sort attributes.",
  },
  attributeSort: {
    type: "choice",
    category: "Global",
    default: "ASC",
    choices: [
      { value: "ASC", description: "Sort attributes in ascending order." },
      { value: "DESC", description: "Sort attributes in descending order." },
    ] as const,
    description: "Provide a sort order for attributes.",
  },
  attributeIgnoreCase: {
    type: "boolean",
    category: "Global",
    array: false,
    default: false,
    description: "Provide a case sensitivity boolean flag",
  },
} satisfies SupportOptions;

export interface PluginConfig {
  attributeGroups: string[];
  attributeSort: "ASC" | "DESC";
  attributeIgnoreCase: boolean;
}

// options parser ------------------------------------------
export type PluginOptions = {
  attributeGroups: string[];
  attributeSort: "ASC" | "DESC";
  attributeIgnoreCase: boolean;
};

export function parseOptions(options: any) {
  if (typeof options !== "object") {
    throw new Error("options must be an object");
  }
  if (options === undefined) {
    throw new Error("options must not be undefined");
  }
  if (options === null) {
    throw new Error("options must not be null");
  }

  const keys = Object.keys(options);
  if (!keys.includes("attributeGroups")) {
    throw new Error("options must include attributeGroups");
  }
  if (!Array.isArray(options.attributeGroups)) {
    throw new Error("options.attributeGroups must be an array");
  }
  if (options.attributeGroups.some((group: any) => typeof group !== "string")) {
    throw new Error("options.attributeGroups must be an array of strings");
  }

  if (!keys.includes("attributeSort")) {
    throw new Error("options must include attributeSort");
  }
  if (typeof options.attributeSort !== "string") {
    throw new Error("options.attributeSort must be a string");
  }
  if (!["ASC", "DESC"].includes(options.attributeSort)) {
    throw new Error("options.attributeSort must be either ASC or DESC");
  }

  if (!keys.includes("attributeIgnoreCase")) {
    throw new Error("options must include attributeIgnoreCase");
  }
  if (typeof options.attributeIgnoreCase !== "boolean") {
    throw new Error("options.attributeIgnoreCase must be a boolean");
  }

  return {
    attributeGroups: options.attributeGroups,
    attributeSort: options.attributeSort,
    attributeIgnoreCase: options.attributeIgnoreCase,
  };
}
