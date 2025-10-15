import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
};
export default config;
