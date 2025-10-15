import { provideRouter } from "@angular/router";
import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { routes } from "../../../app.routes";
import { ApiService } from "../../../services/api.service";
import {
  AuthenticationService,
  MockAuthenticationService,
} from "../../../services/is-authenticated.service";
import LoginFormService, {
  mockLogin,
} from "../../Organisms/LoginForm/login-form.service";
import { LoginPageComponent } from "./login-page.component";
import {
  LocationService,
  MockLocationService,
} from "../../../services/location.service";

const meta = {
  title: "Pages/LoginPage",
  component: LoginPageComponent,
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService,
        },
        provideRouter([]),
      ],
    }),
  ],
} satisfies Meta<LoginPageComponent>;
const standardProviders = [
  provideRouter(routes),
  LoginFormService,
  {
    provide: LocationService,
    useFactory: () => new MockLocationService("/login"),
  },
];

export default meta;

export const LoginPageWithSuccess: StoryObj<LoginPageComponent> = {
  decorators: [
    applicationConfig({
      providers: [
        ...standardProviders,
        { provide: ApiService, useValue: mockLogin(true) },
      ],
    }),
  ],
};

export const LoginPageWithFailure: StoryObj<LoginPageComponent> = {
  decorators: [
    applicationConfig({
      providers: [
        ...standardProviders,
        { provide: ApiService, useValue: mockLogin(false) },
      ],
    }),
  ],
};
