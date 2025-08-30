import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  declarationKind: {
    type: "string",
    category: "Global",
    array: true,
    default: [{ value: [] }],
    description: "Provide a condition preset and declaration kind.",
  },
});
