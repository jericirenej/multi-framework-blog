import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { DeleteIconComponent } from "./delete-icon.component";
const meta = {
  title: "Atoms/DeleteIcon",
  component: DeleteIconComponent,
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="height: 40px;">${story}</div>`,
    ),
  ],
} satisfies Meta<DeleteIconComponent>;

export default meta;
export const ArrowIcon: StoryObj<DeleteIconComponent> = { name: "DeleteIcon" };
