import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { EditIconComponent } from "./edit-icon.component";
const meta = {
  title: "Atoms/EditIcon",
  component: EditIconComponent,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="height: 40px;">${story}</div>`,
    ),
  ],
} satisfies Meta<EditIconComponent>;

export default meta;
export const ArrowIcon: StoryObj<EditIconComponent> = { name: "EditIcon" };
