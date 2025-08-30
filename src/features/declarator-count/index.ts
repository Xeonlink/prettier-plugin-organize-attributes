import { defineFeature } from "@/utils/feature";
import { options } from "./options";
import { withEstreeModifier } from "./estree";

export default defineFeature({
  options: options,
  parsers: (parsers) => ({
    babel: withEstreeModifier(parsers.babel),
    typescript: withEstreeModifier(parsers.typescript),
  }),
});
