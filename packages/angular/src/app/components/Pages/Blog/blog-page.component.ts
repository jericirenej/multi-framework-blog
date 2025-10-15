import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Title } from "@angular/platform-browser";
import { filter, switchMap, tap } from "rxjs";
import { ApiService } from "../../../services/api.service";
import { BlogComponent } from "../../Molecules/Blog/blog.component";
import { PageWrapperComponent } from "../../Templates/PageWrapper/page-wrapper.component";

@Component({
  selector: "app-blog-page",
  imports: [BlogComponent, PageWrapperComponent, AsyncPipe],
  templateUrl: "./blog-page.component.html",

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {
  protected readonly apiService = inject(ApiService);
  protected readonly titleService = inject(Title);
  readonly blogId = input<string>();
  protected blog = toObservable(this.blogId).pipe(
    filter((blogId): blogId is string => !!blogId),
    switchMap((blogId) => this.apiService.getBlog(blogId)),
    tap(({ title, author_name }) => {
      this.titleService.setTitle(`${author_name}: ${title}`);
    }),
  );
}
