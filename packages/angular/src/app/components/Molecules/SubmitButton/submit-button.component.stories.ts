import { type Meta, type StoryObj } from "@storybook/angular";
import buttonMeta from "../../Atoms/Button/button.component.stories";
import { SubmitButtonComponent } from "./submit-button.component";

const meta: Meta<SubmitButtonComponent> = {
  title: "Molecules/SubmitButton",
  component: SubmitButtonComponent,
  argTypes: {
    ...buttonMeta.argTypes,
    isSubmitting: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    ...buttonMeta.args,
    type: "submit",
    isSubmitting: false,
    label: "Submit",
  },
};

export default meta;

export const SubmitButtonComponentStory: StoryObj<SubmitButtonComponent> = {
  name: "SubmitButton",
};
