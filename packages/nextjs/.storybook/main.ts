import type { StorybookConfig } from "@storybook/nextjs";
import { modifyConfigurationForSvgr } from "../src/svgr.config";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: (config) => modifyConfigurationForSvgr(config),
};
export default config;
