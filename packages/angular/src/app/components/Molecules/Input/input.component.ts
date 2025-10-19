import styles from "@/styles/components/Molecules/input";
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { asapScheduler } from "rxjs";
import { v4 } from "uuid";
import { IdService } from "../../../services/id.service";

type FunctionType = (...args: unknown[]) => unknown;

export type SimpleInputType =
  | "number"
  | "date"
  | "email"
  | "password"
  | "text"
  | "textarea";

@Component({
  selector: "app-input",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    "[attr.tabindex]": "-1",
    /** Focusing the host means focusing the input */
    "(focus)": "focus()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./input.component.html",
  styles: `
    :host {
      display: inline-block;
    }
  `,
})
export class InputComponent {
  protected readonly styles = styles;
  readonly label = input.required<string>();
  readonly type = input<SimpleInputType>("text");
  /** Optional errId identifier. If input is empty, the component will check if `IdService`
   * is provided to the host element and use it's `id` to mark the error id component. */
  readonly errId = input<string>();
  readonly name = input<string>();
  protected elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly idService = inject(IdService, {
    host: true,
    optional: true,
  });

  protected onChange: FunctionType = () => {};
  protected onTouch: FunctionType = () => {};

  constructor() {
    /** Prevent transitions from firing on initial render. */
    afterNextRender(() => {
      asapScheduler.schedule(() => {
        this.canLabelTransition.set(true);
      });
    });
  }

  protected readonly value = signal<string>("");
  protected readonly isInvalid = signal<boolean>(false);
  protected readonly computedErrId = computed(
    () => this.errId() ?? this.idService?.id,
  );
  protected disabled = signal(false);

  protected inputId = v4();
  protected canLabelTransition = signal(false);

  /** Errors are recognized for dirty elements with an ng-invalid class */
  get hasErrors() {
    return (
      this.elementRef.nativeElement.classList.contains("ng-invalid") &&
      !this.elementRef.nativeElement.classList.contains("ng-pristine")
    );
  }

  get inputEl() {
    return this.elementRef.nativeElement.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`.${this.styles.inputElementClass}`);
  }

  focus() {
    this.inputEl?.focus();
  }

  input(ev: Event) {
    const type = this.type();
    const value = (ev.currentTarget as HTMLInputElement | HTMLTextAreaElement)
      .value;
    const parsed =
      type === "number"
        ? Number(value)
        : type === "date"
          ? new Date(value)
          : value;

    this.value.set(value);
    this.onChange(parsed);
  }

  writeValue(val: unknown): void {
    const transformed = this.transformToString(val);
    if (this.value() !== transformed) this.value.set(transformed);
  }

  registerOnTouched(fn: FunctionType): void {
    this.onTouch = fn;
  }
  registerOnChange(fn: FunctionType): void {
    this.onChange = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected transformToString(val: unknown): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (val instanceof Date) {
      const isoDate = val.toISOString();
      return isoDate.split("T")[0] as string;
    }
    if (val instanceof Number) {
      return val.toString();
    }
    return "";
  }
}
