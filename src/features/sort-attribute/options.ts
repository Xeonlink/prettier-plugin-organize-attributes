import { defineOptions } from "../../utils/options";

export const options = defineOptions({
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
    description: "Ignore case sensitivity for attribute sorting",
  },
});
