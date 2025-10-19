// @ts-check
import tseslint from "typescript-eslint";
import baseEslint from "../../eslint.base.config.mjs";

export default tseslint.config({
  ignores: ["prettier.config.js"],
  extends: baseEslint,
});
