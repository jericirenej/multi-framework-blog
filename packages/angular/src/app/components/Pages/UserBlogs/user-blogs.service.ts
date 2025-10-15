import type { BlogSummaryDto } from "@/api/schemas";
import { inject, Injectable } from "@angular/core";
import { of, type Observable } from "rxjs";
import { type WindowedRequest } from "../../../services/api.service";
import { BlogPreviewServiceToken } from "../../../services/blog-preview.service";
import { AuthenticationService } from "../../../services/is-authenticated.service";

@Injectable()
export class UserBlogsPreviewService extends BlogPreviewServiceToken {
  protected readonly authService = inject(AuthenticationService);
  readonly pageTitle = "My writings";

  override getBlogs(params: WindowedRequest): Observable<BlogSummaryDto[]> {
    const user = this.authService.me();
    if (!user) return of([]);
    return this.apiService.getUserBlogs({
      ...params,
      user: user.username,
    });
  }
}
