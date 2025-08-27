import { defineFeature } from "@/utils/feature";
import { options } from "./options";
import { withEstreeModifier } from "./estree";
import { withHtmlModifier } from "./html";

export default defineFeature({
  options: options,
  parsers: (parsers) => ({
    babel: withEstreeModifier(parsers.babel),
    typescript: withEstreeModifier(parsers.typescript),
    html: withHtmlModifier(parsers.html),
    vue: withHtmlModifier(parsers.vue),
    angular: withHtmlModifier(parsers.angular),
  }),
});
