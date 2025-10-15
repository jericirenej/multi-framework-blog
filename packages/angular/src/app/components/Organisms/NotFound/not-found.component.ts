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
    <div>
      <div class="wrapper">
        <div class="flex items-center justify-center">
          <h1 class="p-2 text-6xl font-light text-cyan-800 uppercase">404</h1>
        </div>
        <div class="h-full w-[2px] bg-neutral-400"></div>
        <div class="flex flex-col gap-2">
          <p class="text-xl text-cyan-800 uppercase">
            This is not the page you are looking for
          </p>
          <p>
            Redirecting to <a routerLink="/" class="underline">Homepage</a> in
            <span>{{ countdown() }}</span>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: "./not-found.component.css",
})
export class NotFoundComponent {
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
