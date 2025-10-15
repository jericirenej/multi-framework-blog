import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { PageWrapperComponent } from "../PageWrapper/page-wrapper.component";
import { IntersectionEventComponent } from "../../Atoms/IntersectionEventComponent/intersection-event.component";

@Component({
  selector: "app-page-wrapper-with-loading",
  imports: [PageWrapperComponent, IntersectionEventComponent],
  template: `<app-page-wrapper
    [pageTitle]="pageTitle()"
    [subtitle]="subtitle()"
  >
    <ng-content />
    <app-intersection-event (trigger)="intersectionEvent.emit()" />
  </app-page-wrapper>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWrapperWithLoadingComponent extends PageWrapperComponent {
  readonly intersectionEvent = output();
}
