import { defineOptions } from "../../utils/options";

export const options = defineOptions({
  sortAttribute: {
    type: "choice",
    category: "Global",
    choices: [
      { value: "on", description: "On" },
      { value: "off", description: "Off" },
      { value: "html", description: "Sort attributes in html/vue/angular only." },
      { value: "estree", description: "Sort attributes in jsx/tsx only." },
    ],
    default: "off",
    description: "On/Off attribute sorting.",
  },
  sortAttributeGroup: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide an order to sort attributes.",
  },
  sortAttributeOrder: {
    type: "choice",
    category: "Global",
    default: "ASC",
    choices: [
      { value: "ASC", description: "Sort attributes in ascending order." },
      { value: "DESC", description: "Sort attributes in descending order." },
    ],
    description: "Provide a sort order for attributes.",
  },
  sortAttributeIgnoreCase: {
    type: "boolean",
    category: "Global",
    array: false,
    default: false,
    description: "Ignore case sensitivity for attribute sorting",
  },
});
