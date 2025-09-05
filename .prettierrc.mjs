/** @type {import("prettier").Config} */
const config = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    //
    "prettier-plugin-organize-imports",
    "prettier-plugin-package",
  ],
};

export default config;
