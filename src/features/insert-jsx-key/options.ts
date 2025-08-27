import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  insertJsxKey: {
    type: "choice",
    category: "Global",
    default: "off",
    choices: [
      { value: "on", description: "Insert key attribute for JSX elements" },
      { value: "off", description: "Do not insert key attribute for JSX elements" },
    ],
    description: "Insert key attribute for JSX elements",
  },
});
