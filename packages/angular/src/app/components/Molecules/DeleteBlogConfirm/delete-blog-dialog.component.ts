import { Component, model, output } from "@angular/core";
import { ButtonComponent } from "../../Atoms/Button/button.component";
import { DialogComponent } from "../Dialog/dialog.component";

@Component({
  selector: "app-delete-blog-dialog",
  imports: [ButtonComponent, DialogComponent],
  template: `
    <app-dialog [(show)]="show" [title]="title"
      ><p>{{ content }}</p>
      <div class="mt-7 flex justify-center gap-4">
        <app-button (clicked)="show.set(false)" variant="cancel">No</app-button>
        <app-button variant="warning" (clicked)="handleConfirmDelete()"
          >Yes</app-button
        >
      </div>
    </app-dialog>
  `,
})
export class DeleteBlogDialogComponent {
  readonly confirmDelete = output();
  readonly show = model<boolean>(false);
  readonly title = "Delete this post?";
  readonly content =
    "Deleting the post is permanent. This action cannot be undone!";

  protected handleConfirmDelete() {
    this.confirmDelete.emit();
    this.show.set(false);
  }
}
