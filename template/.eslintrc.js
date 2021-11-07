module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "react/react-in-jsx-scope": 0,
  },
};
