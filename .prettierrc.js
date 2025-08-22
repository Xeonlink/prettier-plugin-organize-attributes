/** @type {import('prettier').Config} */
const config = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  trailingComma: "all",
  plugins: ["prettier-plugin-organize-imports"],
};

export default config;
