import { exampleBlog } from "@/api/mocks/blog";
import { type Meta, type StoryObj } from "@storybook/angular";
import { BlogComponent } from "./blog.component";

const meta = {
  title: "Molecules/Blog",
  component: BlogComponent,
  argTypes: { blog: { control: "object" } },

  args: {
    blog: exampleBlog,
  },
} satisfies Meta<BlogComponent>;

export default meta;
export const Blog: StoryObj<BlogComponent> = {};
