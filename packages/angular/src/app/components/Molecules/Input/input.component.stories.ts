import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import type { Meta, StoryObj } from "@storybook/angular";
import { v4 } from "uuid";
import { InputComponent, type SimpleInputType } from "./input.component";

@Component({
  selector: "storybook-input",
  imports: [InputComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div [formGroup]="form">
    <app-input
      [type]="type()"
      [name]="name()"
      [label]="label()"
      formControlName="control"
      errId="errId"
    />
    @if (form.controls.control.errors) {
      <span id="errId" aria-live="polite"></span>
    }
  </div>`,
})
class InputWrapperComponent {
  readonly type = input.required<SimpleInputType>();
  readonly label = input.required<string>();
  readonly name = input<string>();
  protected inputId = v4();

  readonly disabled = input(false);
  readonly value = input<string>();
  form = new FormGroup({
    control: new FormControl(this.value(), {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const control = this.form.controls.control;
      if (control.value === this.value()) return;
      control.patchValue(this.value());
    });
    effect(() => {
      if (this.disabled()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }
}

const config: Meta<InputWrapperComponent> = {
  component: InputWrapperComponent,
  title: "Molecules/Input",
  argTypes: {
    disabled: { control: "boolean" },
    type: {
      control: "inline-radio",
      options: ["text", "number", "date", "email", "password", "textarea"],
    },
    label: { control: "text" },
    value: { control: "text" },
    name: { control: "text" },
  },
  args: {
    disabled: false,
    type: "text",
    label: "Input label",
    value: "Initial value",
  },
};
export default config;

export const InputStory: StoryObj<InputWrapperComponent> = { name: "Input" };
