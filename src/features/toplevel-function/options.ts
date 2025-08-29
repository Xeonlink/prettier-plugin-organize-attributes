import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  toplevelFunction: {
    type: "choice",
    category: "Global",
    default: "preserve",
    choices: [
      { value: "force-arrow-function", description: "Force arrow function" },
      { value: "force-function-declaration", description: "Force function declaration" },
      { value: "preserve", description: "Preserve" },
    ],
    description: "Style top level function behavior",
  },
});
