import type { BlogSummaryDto } from "@/api/schemas";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { type WindowedRequest } from "../../../services/api.service";
import { BlogPreviewServiceToken } from "../../../services/blog-preview.service";

@Injectable()
export class HomepagePreviewService extends BlogPreviewServiceToken {
  readonly pageTitle = "Blogs";
  override getBlogs(params: WindowedRequest): Observable<BlogSummaryDto[]> {
    return this.apiService.getBlogs(params);
  }
}
