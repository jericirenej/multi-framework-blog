import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-page-title",
  template: ` <h1
    class="text-center text-3xl font-light uppercase text-cyan-800"
  >
    <ng-content />
  </h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
