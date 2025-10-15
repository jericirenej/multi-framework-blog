import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { add } from "date-fns";
import { of } from "rxjs";
import { routes } from "../../../app.routes";
import { createBlog } from "../../../helpers/storybook";
import { ApiService } from "../../../services/api.service";
import {
  AuthenticationService,
  MockAuthenticationService,
} from "../../../services/is-authenticated.service";
import {
  LocationService,
  MockLocationService,
} from "../../../services/location.service";
import { BlogPageComponent } from "./blog-page.component";

const id = "id";

@Component({
  selector: "blog-page-wrapper",
  imports: [BlogPageComponent],
  template: `<app-blog-page [blogId]="id()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BlogPageWrapperComponent {
  readonly id = input<string>();
}
const mockLocation = new MockLocationService(`/blog/${id}`);

const meta = {
  title: "Pages/BlogPage",
  component: BlogPageWrapperComponent,
  args: { id },
} satisfies Meta<BlogPageWrapperComponent>;
export default meta;
export const BlogPage: StoryObj<BlogPageWrapperComponent> = {
  name: "BlogPage",
  decorators: [
    applicationConfig({
      providers: [
        provideRouter(routes),
        { provide: LocationService, useValue: mockLocation },
        {
          provide: ApiService,
          useValue: {
            getBlog(id: string) {
              return of(
                createBlog({
                  authorId: "johnDoe",
                  authorName: "John Doe",
                  blogId: id,
                }),
              );
            },
          },
        },
        {
          provide: AuthenticationService,
          useFactory: () => {
            const mockAuth = new MockAuthenticationService();
            mockAuth.setMe({
              exp: add(new Date(), { days: 1 }).getTime(),
              id: "johnDoe",
              name: "John Doe",
              username: "johnDoe",
            });
            return mockAuth;
          },
        },
      ],
    }),
  ],
};
