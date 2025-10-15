import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonComponent } from "../../Atoms/Button/button.component";
import { DeleteBlogDialogComponent } from "./delete-blog-dialog.component";

@Component({
  selector: "storybook-delete-blog-dialog",
  imports: [DeleteBlogDialogComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <app-delete-blog-dialog
      [(show)]="show"
      (confirmDelete)="confirmDelete.emit()"
    />
    <app-button
      class="mt-5 inline-block"
      type="button"
      size="sm"
      (clicked)="show.set(true)"
      >Show dialog</app-button
    >
  </div>`,
})
class DeleteBlogWrapperComponent {
  readonly confirmDelete = output();
  protected readonly show = signal(true);
}

const config: Meta<DeleteBlogWrapperComponent> = {
  title: "Molecules/DeleteBlogConfirm",
  component: DeleteBlogWrapperComponent,
  argTypes: {
    confirmDelete: { action: "Confirm delete" },
  },
};

export default config;
export const DeleteBlogDialogStory: StoryObj<DeleteBlogWrapperComponent> = {
  name: "DeleteBlogConfirm",
};
