import { NgStyle } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { ErrorComponent } from "./error.component";

@Component({
  selector: "storybook-error-wrapper",
  imports: [ErrorComponent, NgStyle],
  template: `<div
    class="inline-block border-1 border-dotted border-neutral-400"
    [ngStyle]="{ width: width() }"
  >
    <app-error [errors]="errors()" />
  </div>`,
})
class ErrorWrapperComponent {
  readonly errors = input<string>();
  readonly containerCharWidth = input.required<number>();
  protected readonly width = computed(() => `${this.containerCharWidth()}ch`);
}
const config: Meta<ErrorWrapperComponent> = {
  component: ErrorWrapperComponent,
  title: "Atoms/Error",
  argTypes: {
    errors: { control: "text" },
    containerCharWidth: { control: "number" },
  },
  args: {
    errors: "Required.",
    containerCharWidth: 100,
  },
};

export default config;

export const ErrorStory: StoryObj<ErrorWrapperComponent> = { name: "Error" };
