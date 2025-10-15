import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { NavbarComponent } from "./navbar.component";
import { provideRouter } from "@angular/router";
import { routes } from "../../../app.routes";

const meta = {
  title: "Organisms/Navbar",
  component: NavbarComponent,
  argTypes: {
    authenticated: { control: "boolean" },
    logout: { action: "logout" },
    currentUrl: { control: "inline-radio", options: ["/", "/login"] },
  },
  args: { authenticated: false, currentUrl: "/" },
  decorators: [applicationConfig({ providers: [provideRouter(routes)] })],
} satisfies Meta<NavbarComponent>;

export default meta;

export const NavBar: StoryObj<NavbarComponent> = { name: "Navbar" };
