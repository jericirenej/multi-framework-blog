import type { Meta, StoryObj } from "@storybook/angular";
import { SpinnerComponent } from "./spinner.component";

const meta: Meta<SpinnerComponent> = {
  title: "Atoms/Spinner",
  component: SpinnerComponent,
  argTypes: { duration: { control: "number" }, color: { control: "color" } },
  args: { duration: 1.5, color: "currentColor" },
};
export default meta;
export const SpinnerStory: StoryObj<SpinnerComponent> = { name: "Spinner" };
