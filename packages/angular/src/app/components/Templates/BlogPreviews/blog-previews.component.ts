import type { BlogSummaryDto } from "@/api/schemas";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { concatMap, filter, type Observable, Subject, tap } from "rxjs";
import { ApiService } from "../../../services/api.service";
import { BlogPreviewServiceToken } from "../../../services/blog-preview.service";
import { AuthenticationService } from "../../../services/is-authenticated.service";
import { BlogPreviewComponent } from "../../Organisms/BlogPreview/blog-preview.component";
import { PageWrapperWithLoadingComponent } from "../PageWrapperWithLoading/page-wrapper-with-loading.component";

@Component({
  selector: "app-blogs-preview-template",
  templateUrl: "./blog-previews.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogPreviewComponent, PageWrapperWithLoadingComponent],
})
export abstract class BlogPreviewTemplate {
  protected readonly blogPreviewService = inject(BlogPreviewServiceToken);
  protected readonly limit = 20;
  readonly authenticated = inject(AuthenticationService).authenticated;
  protected apiService = inject(ApiService);
  protected readonly blogs = signal<BlogSummaryDto[]>([]);

  protected readonly loadMore$ = new Subject<void>();
  /** Loading more items is only allowed if a request for blogs does not
   * return an empty array. */
  protected canLoadMore = false;

  constructor() {
    this.getBlogs().subscribe();
    this.loadMore$
      .pipe(
        filter(() => this.canLoadMore),
        concatMap(() => this.getBlogs()),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  protected getBlogs(): Observable<BlogSummaryDto[]> {
    return this.blogPreviewService
      .getBlogs({ offset: this.blogs().length, limit: this.limit })
      .pipe(
        tap((data) => {
          this.canLoadMore = !!data.length;
          if (!this.canLoadMore) return;
          this.blogs.update((prev) => [...prev, ...data]);
        }),
      );
  }

  handleDelete(postId: string): void {
    this.apiService
      .deleteBlog(postId)
      .pipe(
        tap(() => {
          this.blogs.set(this.blogs().filter((blog) => blog.id !== postId));
        }),
      )
      .subscribe();
  }
}
