import type { BlogSummaryDto } from "@/api/schemas/blog";
import style from "@/styles/components/Organisms/blogPreview";
import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { IsAuthorPipe } from "../../../pipes/is-author.pipe";
import { BoxComponent } from "../../Atoms/Box/box.component";
import { DeleteIconComponent } from "../../Atoms/DeleteIcon/delete-icon.component";
import { EditIconComponent } from "../../Atoms/EditIcon/edit-icon.component";
import { DeleteBlogDialogComponent } from "../../Molecules/DeleteBlogConfirm/delete-blog-dialog.component";

@Component({
  selector: "app-blog-preview",
  imports: [
    BoxComponent,
    DatePipe,
    IsAuthorPipe,
    DeleteIconComponent,
    EditIconComponent,
    AsyncPipe,
    RouterLink,
    DeleteBlogDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./blog-preview.component.html",
})
export class BlogPreviewComponent {
  protected readonly style = style;
  readonly data = input.required<BlogSummaryDto>();
  protected elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  protected show = signal(false);

  readonly clicked = output<string>();
  readonly deleteAction = output();
}
