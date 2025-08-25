import { defineFeature } from "../../utils/feature";
import { withEstreeModifier } from "./estree";
import { withHtmlModifier } from "./html";
import { options } from "./options";

export default defineFeature({
  options: options,
  parsers: (parsers) => ({
    // jsx
    babel: withEstreeModifier(parsers.babel),
    // tsx
    typescript: withEstreeModifier(parsers.typescript),
    // html
    html: withHtmlModifier(parsers.html),
    // vue
    vue: withHtmlModifier(parsers.vue),
    // angular
    angular: withHtmlModifier(parsers.angular),
  }),
});
