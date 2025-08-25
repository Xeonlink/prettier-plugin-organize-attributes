import { defineOptions } from "../../utils/options";

export const options = defineOptions({
  propertyGroups: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide an order to sort properties.",
  },
  propertySort: {
    type: "choice",
    category: "Global",
    default: "ASC",
    choices: [
      { value: "ASC", description: "Sort properties in ascending order." },
      { value: "DESC", description: "Sort properties in descending order." },
    ] as const,
    description: "Provide a sort order for properties.",
  },
  propertyIgnoreCase: {
    type: "boolean",
    category: "Global",
    array: false,
    default: false,
    description: "Ignore case sensitivity for property sorting",
  },
});
