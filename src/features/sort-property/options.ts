import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  sortProperty: {
    type: "choice",
    category: "Global",
    default: "off",
    choices: [
      { value: "on", description: "On property sorting." },
      { value: "off", description: "Off property sorting." },
    ],
    description: "On/Off property sorting.",
  },
  sortPropertyGroup: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: ["$EXPRESSION", "$NULL", "$UNDEFINED"] }],
    description: "Provide an order to sort properties.",
  },
  sortPropertyOrder: {
    type: "choice",
    category: "Global",
    default: "ASC",
    choices: [
      { value: "ASC", description: "Sort properties in ascending order." },
      { value: "DESC", description: "Sort properties in descending order." },
    ],
    description: "Provide a sort order for properties.",
  },
  sortPropertyIgnoreCase: {
    type: "boolean",
    category: "Global",
    array: false,
    default: false,
    description: "Ignore case sensitivity for property sorting",
  },
});
