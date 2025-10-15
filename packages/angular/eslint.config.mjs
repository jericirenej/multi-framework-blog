// @ts-check
import storybook from "eslint-plugin-storybook";

import tseslint from "typescript-eslint";
import baseEslint from "../../eslint.base.config.mjs";
import angular from "angular-eslint";

export default tseslint.config(
  { ignores: ["dist", ".angular"] },
  {
    files: ["**/*.ts"],
    extends: [baseEslint, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
  storybook.configs["flat/recommended"],
);
