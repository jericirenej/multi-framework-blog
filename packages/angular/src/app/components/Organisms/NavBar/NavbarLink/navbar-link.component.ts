import style from "@/styles/components/Organisms/navbar";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-navbar-link",
  imports: [RouterLink],
  template: ` <a
    [class]="style.navlink(currentUrl() === href())"
    [routerLink]="href()"
    >{{ label() }}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarLinkComponent {
  protected readonly style = style;
  readonly href = input.required<string>();
  readonly label = input.required<string>();
  readonly currentUrl = input.required<string>();
}
