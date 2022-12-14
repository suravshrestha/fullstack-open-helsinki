module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // for 'module' is not defined. (no-undef)
    jest: true, // for 'test', 'expect' is not defined. (no-undef)
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:cypress/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
