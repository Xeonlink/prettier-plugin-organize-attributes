import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  maxDeclaratorInline: {
    type: "int",
    category: "Global",
    default: 0,
    array: false,
    description: "Maximum number of declarators in a variable declaration (0 = unlimited)",
  },
});
