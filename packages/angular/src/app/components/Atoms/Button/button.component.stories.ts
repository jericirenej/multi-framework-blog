import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonComponent } from "./button.component";

@Component({
  selector: "storybook-button-wrapper",
  imports: [ButtonComponent],
  template: `<app-button
    [disabled]="disabled()"
    [type]="type()"
    [variant]="variant()"
    (clicked)="clicked.emit()"
    [size]="size()"
    >{{ content() }}</app-button
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonWrapperComponent extends ButtonComponent {
  readonly content = input("Button text");
}

const config = {
  title: "Atoms/Button",
  component: ButtonWrapperComponent,
  argTypes: {
    content: {
      control: "text",
      description: "Represents the button's projected content",
    },
    disabled: { control: "boolean" },
    type: { control: "radio", options: ["button", "submit", "reset"] },
    variant: {
      control: "radio",
      options: ["confirm", "cancel", "warning", "info", "cancel"],
    },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    clicked: { action: "click" },
  },

  args: {
    content: "Button content",
    disabled: false,
    type: "button",
    variant: "confirm",
    size: "md",
  },
} satisfies Meta<ButtonWrapperComponent>;

export default config;
type Story = StoryObj<ButtonWrapperComponent>;
export const ButtonComponentStory: Story = { name: "Button" };
