import type { BlogSummaryDto } from "@/api/schemas";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { ApiService, type WindowedRequest } from "./api.service";

@Injectable()
export abstract class BlogPreviewServiceToken {
  protected apiService = inject(ApiService);
  abstract readonly pageTitle: string;
  abstract getBlogs(params: WindowedRequest): Observable<BlogSummaryDto[]>;
}
