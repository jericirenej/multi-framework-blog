import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { ArrowIconComponent } from "./arrow.component";
const meta = {
  title: "Atoms/ArrowIcon",
  component: ArrowIconComponent,
  argTypes: {
    direction: { control: "inline-radio", options: ["left", "right"] },
  },
  args: { direction: "right" },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="height: 40px">${story}</div>`,
    ),
  ],
} satisfies Meta<ArrowIconComponent>;

export default meta;
export const ArrowIcon: StoryObj<ArrowIconComponent> = {};
