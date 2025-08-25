import { defineFeature } from "../../utils/feature";
import { options } from "./options";

export default defineFeature({
  options: options,
  parsers: (parsers) => ({
    babel: parsers.babel,
  }),
});
