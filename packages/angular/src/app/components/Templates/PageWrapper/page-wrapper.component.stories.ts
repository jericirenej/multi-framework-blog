import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { add } from "date-fns";
import { of } from "rxjs";
import { routes } from "../../../app.routes";
import { ApiService } from "../../../services/api.service";
import {
  AuthenticationService,
  MockAuthenticationService,
} from "../../../services/is-authenticated.service";
import {
  LocationService,
  MockLocationService,
} from "../../../services/location.service";
import { PageWrapperComponent } from "./page-wrapper.component";

@Component({
  selector: "storybook-page-wrapper",
  imports: [PageWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #wrapper></div>
    <ng-template #ref>
      <app-page-wrapper [pageTitle]="pageTitle()" [subtitle]="subtitle()"
        ><div
          class="flex h-[500px] items-center justify-center bg-cyan-900 text-2xl text-white"
          [style.width]="contentWidth() + 'px'"
        >
          <span>Page projected content</span>
        </div></app-page-wrapper
      >
    </ng-template>
  `,
})
class PageWrapperWrapperComponent {
  readonly authenticated = input<boolean>();
  readonly pageTitle = input.required<string>();
  readonly subtitle = input<string>();
  readonly contentWidth = input.required<number>();
  protected isAuth = inject(
    AuthenticationService,
  ) as unknown as MockAuthenticationService;
  protected locationService = inject(
    LocationService,
  ) as unknown as MockLocationService;
  readonly currentUrl = input.required<string>();
  protected readonly wrapper = viewChild.required<
    HTMLDivElement,
    ViewContainerRef
  >("wrapper", {
    read: ViewContainerRef,
  });
  protected readonly templateRef =
    viewChild.required<TemplateRef<HTMLElement>>("ref");

  constructor() {
    effect(() => {
      this.isAuth.setMe(
        this.authenticated()
          ? {
              exp: add(new Date(), { days: 1 }).getTime(),
              id: "johnDoe-id",
              name: "John Doe",
              username: "johnDoe",
            }
          : null,
      );
      this.locationService.url = this.currentUrl();

      this.wrapper().clear();
      this.wrapper().createEmbeddedView(this.templateRef());
    });
  }
}

const meta = {
  title: "Templates/PageWrapper",
  component: PageWrapperWrapperComponent,
  argTypes: {
    pageTitle: { control: "text" },
    contentWidth: { control: { type: "range", min: 100, max: 1500, step: 50 } },
    authenticated: { control: "boolean" },
    currentUrl: { control: "inline-radio", options: ["/", "/login"] },
    subtitle: { control: "text" },
  },
  args: {
    pageTitle: "Page title",
    subtitle: "",
    contentWidth: 600,
    authenticated: false,
    currentUrl: "/",
  },
  decorators: [
    applicationConfig({
      providers: [
        provideRouter(routes),
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: LocationService, useValue: MockLocationService },
        { provide: ApiService, useValue: { logout: () => of("logged out") } },
      ],
    }),
  ],
} satisfies Meta<PageWrapperWrapperComponent>;

export default meta;

export const PageWrapperStory: StoryObj<PageWrapperWrapperComponent> = {
  name: "PageWrapper",
};
