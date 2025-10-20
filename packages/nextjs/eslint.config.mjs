// @ts-check
import nextPlugin from "@next/eslint-plugin-next";
import a11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";
import baseEslint from "../../eslint.base.config.mjs";

export default tseslint.config(
  {
    extends: baseEslint,
  },
  { ignores: [".next", "prettier.config.mjs", "next-env.d.ts"] },
  {
    files: ["**/*.{ts,tsx}"],
    name: "react",
    extends: [
      reactPlugin.configs.flat.recommended,
      reactHooks.configs.flat["recommended-latest"],
      a11y.flatConfigs.recommended,
    ],
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,jsx,ts,tsy}"],
    name: "nextjs",
    plugins: { "@next/next": nextPlugin },
    // @ts-ignore
    rules: nextPlugin.configs.recommended.rules,
  },
  storybook.configs["flat/recommended"],
);
