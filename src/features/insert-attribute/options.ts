import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  insertAttribute: {
    type: "choice",
    category: "Global",
    default: "off",
    choices: [
      { value: "on", description: "Insert attribute for jsx/html elements" },
      { value: "off", description: "Do not insert attribute for jsx/html elements" },
      { value: "estree", description: "Insert attribute for jsx elements" },
      { value: "html", description: "Insert attribute for html elements" },
    ],
    description: "Insert attribute for jsx/html elements",
  },
  insertAttributeMap: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide a map of tag names and attribute names to insert.",
  },
});
