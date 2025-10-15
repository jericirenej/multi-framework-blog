import { Component, input } from "@angular/core";
import { ArrowIconComponent } from "../../Atoms/Arrow/arrow.component";
import { RouterLink } from "@angular/router";

export type BackLinkInput = Record<"href" | "label", string>;
export const TO_HOMEPAGE: BackLinkInput = {
  href: "/",
  label: "Back to homepage",
};

@Component({
  selector: "app-back-link",
  imports: [ArrowIconComponent, RouterLink],
  template: `
    <a
      class="inline-block h-full w-full rounded-lg p-1 leading-0 text-cyan-800 hover:bg-cyan-800/10"
      [routerLink]="backLink().href"
      [title]="backLink().label"
      ><app-arrow direction="left"
    /></a>
  `,
})
export class BackLinkComponent {
  readonly backLink = input.required<BackLinkInput>();
}
