import style from "@/styles/components/Templates/pageWrapper";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { take } from "rxjs";
import { AuthenticationService } from "../../../services/is-authenticated.service";
import { LocationService } from "../../../services/location.service";
import { PageTitleComponent } from "../../Atoms/PageTitle/page-title.component";
import { NavbarComponent } from "../../Organisms/NavBar/navbar.component";

/** Requires a `title` input. Optionally accepts a `subtitle` and `backLink` inputs. */
@Component({
  selector: "app-page-wrapper",
  imports: [PageTitleComponent, NavbarComponent],
  templateUrl: "./page-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWrapperComponent {
  protected readonly style = style;
  protected readonly authService = inject(AuthenticationService);
  readonly authenticated = this.authService.authenticated;
  readonly pageTitle = input.required<string>();
  readonly subtitle = input<string>();

  protected locationService = inject(LocationService);

  handleLogout() {
    this.authService.logout().pipe(take(1)).subscribe();
  }
}
