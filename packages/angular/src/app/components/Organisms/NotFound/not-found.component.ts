import style from "@/styles/components/Organisms/notFound";
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { interval, takeWhile, tap } from "rxjs";

@Component({
  selector: "app-not-found",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div [class]="style.wrapper">
      <div [class]="style.heading.wrapper">
        <h1 [class]="style.heading.errorCode">404</h1>
      </div>
      <div [class]="style.separator"></div>
      <div [class]="style.info.wrapper">
        <p [class]="style.info.text">
          This is not the page you are looking for
        </p>
        <p>
          Redirecting to
          <a routerLink="/" [class]="style.info.link">Homepage</a> in
          <span>{{ countdown() }}</span>
        </p>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  protected readonly style = style;
  readonly navigateEvent = output();
  protected readonly timeLimit = signal(5);
  protected readonly countdown = computed(() => `${this.timeLimit()}s`);

  protected destroyRef = inject(DestroyRef);
  constructor() {
    effect(() => {
      if (this.timeLimit() === 0) {
        this.navigateEvent.emit();
      }
    });
    afterNextRender(() => {
      interval(1e3)
        .pipe(
          tap(() => {
            this.timeLimit.set(this.timeLimit() - 1);
          }),
          takeWhile(() => this.timeLimit() > 0),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }
}
