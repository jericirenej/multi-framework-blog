import type { Meta, StoryObj } from "@storybook/angular";
import { BoxComponent } from "./box.component";

const meta = {
  title: "Atoms/Box",
  component: BoxComponent,
  render: (props) => {
    return {
      props,
      template: `<app-box>
      <h1 class="text-xl font-semibold py-3">Title of projected content</h1>
      <p>And then some text that we are displaying in</p>
      <p>Separate lines that should talk about something</p>
      <p>more or less important</p>
      </app-box>`,
    };
  },
} satisfies Meta<BoxComponent>;
export default meta;
export const BoxStory: StoryObj = { name: "Box" };
