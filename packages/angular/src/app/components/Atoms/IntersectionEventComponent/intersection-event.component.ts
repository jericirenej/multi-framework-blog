import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, Subject, tap } from "rxjs";

@Component({
  selector: "app-intersection-event",
  template: "<ng-content />",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionEventComponent {
  readonly trigger = output();
  protected elementRef = inject(ElementRef) as ElementRef<HTMLElement>;
  protected destroyRef = inject(DestroyRef);
  protected readonly isIntersecting$ = new Subject<boolean>();
  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => {
        this.isIntersecting$.next(entry?.isIntersecting ?? false);
      }, {});
      observer.observe(this.elementRef.nativeElement);
      this.isIntersecting$
        .pipe(
          tap((intersecting) => {
            if (intersecting) {
              this.trigger.emit();
            }
          }),
          finalize(() => {
            observer.disconnect();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }
}
