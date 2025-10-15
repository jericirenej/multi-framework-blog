import { type BlogDto } from "@/api/schemas";
import { ActivatedRoute } from "@angular/router";
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { ApiService } from "../../../services/api.service";
import { BlogFormComponent } from "./blog-form.component";
import {
  AbstractBlogFormService,
  CreateBlogFormService,
  EditBlogFormService,
  mockApiService,
} from "./blog-form.service";

const created_at = new Date("2025-06-01T12:00").getTime();

const exampleBlog: BlogDto = {
  author_id: "johnDoe",
  author_name: "John Doe",
  title: "Example blog title",
  content:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente veniam ut quam ducimus repellendus. Vitae quas maxime quibusdam atque magnam suscipit eligendi mollitia quisquam? Quia minima reiciendis provident dignissimos pariatur!",
  summary:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente veniam ut quam ducimus repellendus.",
  image: null,
  id: "some-example-id",
  created_at,
  updated_at: created_at,
};

const meta = {
  title: "Organisms/BlogForm",
  component: BlogFormComponent,
  argTypes: {
    data: { control: "object", table: { disable: true } },
    defaultErrorMessage: { control: "text" },
    submitLabel: { control: "text" },
    successLabel: { control: "text" },
    goBack: { action: "goBack" },
    status: { action: "status" },
  },
} satisfies Meta<BlogFormComponent>;
export default meta;

const successProvider = {
  provide: ApiService,
  useValue: mockApiService(true, exampleBlog),
};

export const BlogFormCreate: StoryObj<BlogFormComponent> = {
  name: "Create blog",
  args: {
    defaultErrorMessage: "Error while creating blog post",
    successLabel: "Blog post created",
    submitLabel: "Create blog post",
  },
  decorators: [
    applicationConfig({
      providers: [
        { provide: AbstractBlogFormService, useClass: CreateBlogFormService },
        successProvider,
      ],
    }),
  ],
};

export const BlogFormEdit: StoryObj<BlogFormComponent> = {
  name: "Update blog",
  args: {
    defaultErrorMessage: "Error while updating blog",
    successLabel: "Blog updated",
    submitLabel: "Update blog",
    data: { content: exampleBlog.content, title: exampleBlog.title },
  },
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([["blogId", "blogId"]]) } },
        },
        { provide: AbstractBlogFormService, useClass: EditBlogFormService },
        successProvider,
      ],
    }),
  ],
};
