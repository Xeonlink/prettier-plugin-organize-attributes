import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  toplevelFunction: {
    type: "choice",
    category: "Global",
    default: "preserve",
    choices: [
      { value: "force-arrow-function", description: "Force arrow function" },
      { value: "force-function-keyword", description: "Force function keyword" },
      { value: "preserve", description: "Preserve" },
    ],
    description: "Style top level function behavior",
  },
});
