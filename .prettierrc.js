/** @type {import("prettier").Config} */
const config = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  trailingComma: "all",
  plugins: [
    // "@trivago/prettier-plugin-sort-imports",
    // "./dist/src/index.mjs",
    // "prettier-plugin-vue",
    // "prettier-plugin-merge",
    "./dist/merge.mjs",
  ],

  vueIndentScriptAndStyle: false,
};

export default config;
