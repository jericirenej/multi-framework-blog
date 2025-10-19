import style from "@/styles/components/Molecules/backLink";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ArrowIconComponent } from "../../Atoms/Arrow/arrow.component";

export type BackLinkInput = Record<"href" | "label", string>;
export const TO_HOMEPAGE: BackLinkInput = {
  href: "/",
  label: "Back to homepage",
};

@Component({
  selector: "app-back-link",
  imports: [ArrowIconComponent, RouterLink],
  template: `
    <a [class]="style" [routerLink]="backLink().href" [title]="backLink().label"
      ><app-arrow direction="left"
    /></a>
  `,
})
export class BackLinkComponent {
  protected readonly style = style;
  readonly backLink = input.required<BackLinkInput>();
}
