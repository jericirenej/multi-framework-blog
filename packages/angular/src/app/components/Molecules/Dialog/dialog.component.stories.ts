import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonComponent } from "../../Atoms/Button/button.component";
import { InputComponent } from "../Input/input.component";
import { DialogComponent } from "./dialog.component";

@Component({
  selector: "storybook-dialog",
  imports: [DialogComponent, ButtonComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <app-dialog [title]="title()" [(show)]="show">
      <div class="flex flex-col items-center gap-5">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda,
          iste, nobis itaque est qui nemo cupiditate neque cum quam officia ipsa
          molestiae tempore architecto enim repellat? Animi eos reiciendis
          quibusdam.
        </p>
        <app-input type="text" label="Example input" />
      </div>
    </app-dialog>
    <app-button
      class="mt-5 inline-block"
      type="button"
      size="sm"
      (clicked)="show.set(true)"
      >Show dialog</app-button
    >
  </div>`,
})
class DialogComponentWrapper {
  readonly title = input<string, undefined | string>(undefined, {
    transform: (val) => (val?.length ? val : "Attention"),
  });

  protected readonly show = signal(true);
}

const config: Meta<DialogComponentWrapper> = {
  title: "Molecules/Dialog",
  component: DialogComponentWrapper,
  argTypes: {
    title: { control: "text" },
  },
  args: { title: "Modal element" },
};

export default config;
export const DialogStory: StoryObj<DialogComponentWrapper> = { name: "Dialog" };
