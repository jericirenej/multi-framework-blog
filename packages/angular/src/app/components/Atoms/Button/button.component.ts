import button from "@/styles/components/Atoms/button";
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
    return clsx(
      button.baseClass,
      button.activeClasses,
      button.variantClasses[this.variant()],
      button.sizeClasses[this.size()],
    );
  });
}
