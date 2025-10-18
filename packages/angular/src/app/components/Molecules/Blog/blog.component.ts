import type { BlogDto } from "@/api/schemas";
import styles from "@/styles/components/Molecules/blog";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "app-blog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./blog.component.html",
})
export class BlogComponent {
  protected readonly styles = styles;
  readonly blog = input.required<BlogDto>();
  protected readonly paragraphs = computed(() =>
    this.blog()
      .content.replaceAll(/\n{2,}/g, "\n")
      .split("\n"),
  );
}
