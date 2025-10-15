import { provideRouter } from "@angular/router";
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { add } from "date-fns";
import { createBlog } from "../../../helpers/storybook";
import {
  AuthenticationService,
  MockAuthenticationService,
} from "../../../services/is-authenticated.service";
import { BlogPreviewComponent } from "./blog-preview.component";

const meta: Meta<BlogPreviewComponent> = {
  title: "Organisms/BlogPreview",
  component: BlogPreviewComponent,
  argTypes: { data: { control: "object" }, clicked: { action: "Navigated" } },
  args: {
    data: createBlog({ authorId: "johnDoe", authorName: "John Doe" }),
  },
};

export default meta;
export const BlogPreviewAuthorStory: StoryObj<BlogPreviewComponent> = {
  name: "BlogPreview - author",
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: AuthenticationService,
          useFactory: () => {
            const mockAuth = new MockAuthenticationService();

            mockAuth.setMe({
              id: "johnDoe",
              name: "John Doe",
              username: "johnDoe",
              exp: add(new Date(), { days: 1 }).getTime(),
            });
            return mockAuth;
          },
        },
      ],
    }),
  ],
};
export const BlogPreviewNonAuthorStory: StoryObj<BlogPreviewComponent> = {
  name: "BlogPreview - Non author",
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService,
        },
      ],
    }),
  ],
};
