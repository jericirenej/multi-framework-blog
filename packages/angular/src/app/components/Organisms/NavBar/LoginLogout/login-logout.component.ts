import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { NavbarLinkComponent } from "../NavbarLink/navbar-link.component";

@Component({
  selector: "app-login-logout",
  imports: [NavbarLinkComponent],
  template: `
    @if (!authenticated()) {
      <app-navbar-link
        [currentUrl]="currentUrl()"
        [href]="href()"
        [label]="label()"
      />
    } @else {
      <button class="cursor-pointer" (click)="logout.emit()">Logout</button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLogoutComponent extends NavbarLinkComponent {
  readonly authenticated = input.required<boolean>();
  readonly logout = output();
}
