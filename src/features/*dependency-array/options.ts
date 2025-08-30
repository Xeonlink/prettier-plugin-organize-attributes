import { defineOptions } from "@/utils/options";

export const options = defineOptions({
  dependencyArray: {
    type: "choice",
    category: "Global",
    default: "preserve",
    choices: [
      { value: "preserve", description: "Preserve dependency array" },
      { value: "ensure-array", description: "Force insert empty array when no dependency array" },
      { value: "ensure-dependency", description: "Insert all dependencies to dependency array" },
      { value: "ensure-only-dependency", description: "Insert only dependencies to dependency array" },
    ],
    description: "Style dependency array behavior",
  },
});
