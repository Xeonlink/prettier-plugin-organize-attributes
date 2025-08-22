/** @type {import("prettier").Config} */
const config = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  trailingComma: "all",
  plugins: ["@trivago/prettier-plugin-sort-imports", "./dist/index.mjs", "prettier-plugin-merge"],
};

export default config;
