import { defineFeature } from "../../utils/feature";
import { withEstreeModifier } from "./estree";
import { options } from "./options";

export default defineFeature({
  options: options,
  parsers: (parsers) => ({
    babel: withEstreeModifier(parsers.babel),
  }),
});
