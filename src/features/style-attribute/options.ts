import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  styleAttribute: {
    type: "choice",
    category: "Global",
    default: "off",
    choices: [
      { value: "on", description: "On" },
      { value: "off", description: "Off" },
    ],
    description: "Style attribute on/off",
  },
  styleAttributeBrace: {
    type: "choice",
    category: "Global",
    default: "preserve",
    choices: [
      { value: "force-brace", description: "Force brace" },
      { value: "force-no-brace", description: "Force no brace" },
      { value: "preserve", description: "Preserve" },
    ],
    description: "Style attribute brace behavior",
  },
  styleAttributeFunction: {
    type: "choice",
    category: "Global",
    default: "preserve",
    choices: [
      { value: "force-arrow-function", description: "Force arrow function" },
      { value: "force-function-expression", description: "Force function expression" },
      { value: "preserve", description: "Preserve" },
    ],
    description: "Style attribute function behavior",
  },
});
