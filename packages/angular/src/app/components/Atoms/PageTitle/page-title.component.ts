import style from "@/styles/components/Atoms/pageTitle";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-page-title",
  template: ` <h1 [class]="style">
    <ng-content />
  </h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {
  protected readonly style = style;
}
