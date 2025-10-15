import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import { InputComponent } from "../Input/input.component";
import { InputWrapperComponent } from "./input-wrapper.component";

@Component({
  selector: "storybook-text-input-wrapper",
  imports: [InputWrapperComponent, InputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div class="flex flex-col items-start gap-5">
        <div class="flex w-max flex-nowrap gap-3">
          <app-input-wrapper [control]="text"
            ><app-input type="text" formControlName="text" [label]="label()"
          /></app-input-wrapper>
          <p class="mt-2 text-sm whitespace-nowrap">
            Control value: {{ form.controls.text.value }}
          </p>
        </div>
        <div class="flex gap-4">
          <button
            class="w-[8ch] cursor-pointer rounded border-1 border-neutral-500 p-2 text-center text-sm hover:bg-neutral-100"
            (click)="toggleDisabled()"
          >
            {{ form.disabled ? "Enable" : "Disable" }}
          </button>
          <button
            class="w-[8ch] cursor-pointer rounded border-1 border-neutral-500 p-2 text-center text-sm hover:bg-neutral-100"
            (click)="reset()"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class InputWrapperStoryComponent {
  readonly label = input<string>("Control label");
  protected fb = inject(FormBuilder);
  protected form = this.fb.group({
    text: this.fb.control("", {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });
  get text() {
    return this.form.controls.text;
  }

  reset() {
    this.form.reset();
  }

  toggleDisabled() {
    this.form[this.form.enabled ? "disable" : "enable"]();
  }
}

const config: Meta<InputWrapperStoryComponent> = {
  component: InputWrapperStoryComponent,
  argTypes: { label: { control: "text" } },
  args: { label: "Control label" },
  title: "Molecules/InputWrapper",
};

export default config;

export const Story: StoryObj<InputWrapperStoryComponent> = {
  name: "InputWrapper",
};
