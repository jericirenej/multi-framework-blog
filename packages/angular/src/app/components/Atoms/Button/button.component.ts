import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { clsx } from "clsx";

const variantClasses = {
  confirm:
    "border-green-700 bg-green-50 text-green-700 decoration-green-700 shadow-green-600/20",
  warning:
    "border-red-700 bg-red-100 text-red-700 decoration-red-700 shadow-red-600/20",
  cancel:
    "border-neutral-700 bg-neutral-100 text-neutral-700 decoration-neutral-700 shadow-neutral-600/20",
  info: "border-violet-700 bg-violet-100 text-violet-700 decoration-violet-700 shadow-violet-600/20",
};

const sizeClasses = {
  sm: "text-sm px-3 py-2 ",
  md: "text-md px-3 py-2",
  lg: "text-[18px] px-3 py-3",
};

const activeClasses =
  "active:scale-96 [.active]:scale-96 disabled:[.active]:scale-100 disabled:[.active]:shadow-none active:shadow-xs [.active]:shadow-xs disabled:active:scale-100 disabled:active:shadow-none";

@Component({ selector: "app-abstract-button", template: "" })
export abstract class AbstractButtonComponent {
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly variant = input<"confirm" | "cancel" | "warning" | "info">(
    "confirm",
  );
  readonly size = input<"sm" | "md" | "lg">("md");
  readonly disabled = input(false);
  readonly clicked = output();
}
@Component({
  selector: "app-button",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <button
      #ref
      [ngClass]="[styles(), isActive() ? 'active' : '']"
      [disabled]="disabled()"
      [type]="type()"
      (click)="clicked.emit()"
      (keydown)="handleKeyPress($event)"
      (keyup)="handleKeyPress($event)"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent extends AbstractButtonComponent {
  protected isActive = signal(false);

  protected readonly ref =
    viewChild.required<ElementRef<HTMLButtonElement>>("ref");

  protected readonly cdr = inject(ChangeDetectorRef);

  protected handleKeyPress(ev: KeyboardEvent) {
    if (ev.key !== "Enter") {
      this.isActive.set(false);
      return;
    }
    this.isActive.set(ev.type === "keydown" ? true : false);
  }

  focus() {
    this.ref().nativeElement.focus();
    this.cdr.detectChanges();
  }

  protected readonly styles = computed(() => {
    const variant = variantClasses[this.variant()];
    const size = sizeClasses[this.size()];
    return clsx(
      "min-w-[7ch] border-1 outline-hidden cursor-pointer rounded-md no-underline decoration-1 underline-offset-4 outline-offset-2 outline-transparent transition-all duration-50 focus-visible:underline focus-visible:outline-2 focus-visible:shadow-xs disabled:opacity-75 disabled:cursor-not-allowed ",
      activeClasses,
      variant,
      size,
    );
  });
}
