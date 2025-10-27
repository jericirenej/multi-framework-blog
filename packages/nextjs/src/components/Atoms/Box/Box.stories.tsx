import type { Meta, StoryObj } from "@storybook/nextjs";
import BoxComponent from "./Box";

type Box = typeof BoxComponent;

const meta = {
  title: "Atoms/Box",
  component: BoxComponent,
} satisfies Meta<Box>;
export default meta;

export const BoxStory: StoryObj<Box> = {
  name: "Box",
  render: () => (
    <BoxComponent>
      <h1 className="py-3 text-xl font-semibold">Title of projected content</h1>
      <p>And then some text that we are displaying in</p>
      <p>Separate lines that should talk about something</p>
      <p>more or less important</p>
    </BoxComponent>
  ),
};
