import type { Meta, StoryObj } from "@storybook/angular";
import { FormInputComponent } from "./form-input.component";
import { FormControl, Validators } from "@angular/forms";
import type { SimpleInputType } from "../../Molecules/Input/input.component";

const control = new FormControl("example", {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(5)],
});

const meta = {
  title: "Organisms/FormInput",
  component: FormInputComponent,
  argTypes: {
    control: { table: { disable: true } },
    label: { control: "text" },
    type: {
      control: "inline-radio",
      options: [
        "text",
        "number",
        "password",
        "date",
        "email",
        "textarea",
      ] satisfies SimpleInputType[],
    },
  },
  args: {
    label: "Control label",
    type: "text",
    control,
  },
} satisfies Meta<FormInputComponent>;
export default meta;
export const FormInput: StoryObj = {};
