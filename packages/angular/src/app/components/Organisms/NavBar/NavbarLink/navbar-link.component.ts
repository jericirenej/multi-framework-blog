import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-navbar-link",
  imports: [RouterLink],
  template: ` <a
    [class.active]="currentUrl() === href()"
    class="underline-offset-7 [&.active]:pointer-events-none [&.active]:cursor-default [&.active]:underline"
    [routerLink]="href()"
    >{{ label() }}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarLinkComponent {
  readonly href = input.required<string>();
  readonly label = input.required<string>();
  readonly currentUrl = input.required<string>();
}
