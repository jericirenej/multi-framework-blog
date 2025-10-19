import style from "@/styles/components/Organisms/navbar";
import { KeyValuePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LoginLogoutComponent } from "./LoginLogout/login-logout.component";
import { NavbarLinkComponent } from "./NavbarLink/navbar-link.component";

export const NAVBAR_ROUTES = {
  Homepage: "/",
  Login: "/login",
} satisfies Record<string, string>;
export const AUTHENTICATED_ROUTES = { Create: "/blog/create" } satisfies Record<
  string,
  string
>;

@Component({
  selector: "app-navbar",
  imports: [KeyValuePipe, NavbarLinkComponent, LoginLogoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  protected readonly style = style;
  readonly authenticated = input.required<boolean>();
  readonly currentUrl = input.required<string>();
  readonly logout = output();

  protected readonly routes = {
    Homepage: { href: "/", protected: false },
    Create: { href: "/blog/create", protected: true },
    "My blogs": { href: "/blog/personal", protected: true },
    Login: { href: "/login", protected: false },
  };

  protected preserverOrder() {
    return 0;
  }
}
