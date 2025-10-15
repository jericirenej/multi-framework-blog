import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { LoginFormComponent } from "./login-form.component";
import LoginFormService, { mockLogin } from "./login-form.service";
import { ApiService } from "../../../services/api.service";

const mockLoginResult = (
  shouldSucceed = true,
): ReturnType<typeof applicationConfig>[] => [
  applicationConfig({
    providers: [
      LoginFormService,
      { provide: ApiService, useValue: mockLogin(shouldSucceed) },
    ],
  }),
];

const config: Meta<LoginFormComponent> = {
  title: "Organisms/LoginForm",
  component: LoginFormComponent,
  argTypes: { goBack: { action: "goBack" } },
};
export default config;

export const LoginWithSuccess: StoryObj<LoginFormComponent> = {
  decorators: mockLoginResult(),
};

export const LoginWithFailure: StoryObj<LoginFormComponent> = {
  decorators: mockLoginResult(false),
};
