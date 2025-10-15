import { JWT_COOKIE } from "@/api/constants";
import {
  authenticatedDtoSchema,
  userWithExpirationDtoSchema,
  type UserWithExpirationDto,
} from "@/api/schemas";
import {
  blogDtoSchema,
  blogIdDtoSchema,
  blogSummaryDtoSchema,
  createBlogSchema,
  updateBlogSchema,
  type BlogDto,
  type BlogSummaryDto,
} from "@/api/schemas/blog";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, switchMap, type Observable } from "rxjs";
import type { BlogValues } from "../components/Organisms/BlogForm/blog-form.service";
import { resultValidator } from "../helpers/result-validator";

export type WindowedRequest = Partial<Record<"limit" | "offset", number>>;

export const getJWT = (req: Request | null) => {
  return req?.headers
    .get("cookie")
    ?.split(";")
    .find((c) => c.includes(JWT_COOKIE))
    ?.split("=")[1];
};

@Injectable({ providedIn: "root" })
export class ApiService {
  readonly FETCH_LIMIT = 20;
  protected httpClient = inject(HttpClient);
  protected router = inject(Router);

  authenticated(authHeader?: string) {
    return this.httpClient
      .get("/api/auth/authenticated", {
        headers: this.getAuthHeaders(authHeader),
      })
      .pipe(map((result) => authenticatedDtoSchema.parse(result)));
  }
  me(authHeader?: string): Observable<UserWithExpirationDto> {
    return this.httpClient
      .get("/api/auth/me", { headers: this.getAuthHeaders(authHeader) })
      .pipe(map((data) => userWithExpirationDtoSchema.parse(data)));
  }

  login(credentials: { username: string; password: string }) {
    return this.httpClient.post("/api/auth/login", credentials, {
      responseType: "text",
    });
  }
  logout() {
    return this.httpClient
      .delete("/api/auth/logout", { responseType: "text" })
      .pipe(
        switchMap(() => {
          return this.router.navigate(["/"]);
        }),
      );
  }

  getBlogs({ limit = this.FETCH_LIMIT, offset = 0 }: WindowedRequest) {
    return resultValidator(
      this.httpClient.get<BlogSummaryDto[]>("/api/blog/all", {
        params: new HttpParams({ fromObject: { limit, offset } }),
      }),
      blogSummaryDtoSchema,
    );
  }

  getUserBlogs({
    user,
    limit = this.FETCH_LIMIT,
    offset = 0,
  }: WindowedRequest & { user: string }) {
    return resultValidator(
      this.httpClient.get<BlogSummaryDto[]>(`/api/blog/author/${user}`, {
        params: new HttpParams({ fromObject: { limit, offset } }),
      }),
      blogSummaryDtoSchema,
    );
  }

  getBlogsIds() {
    return this.httpClient
      .get("/api/blog/all/ids")
      .pipe(
        map((result) =>
          [result].flat().map((val) => blogIdDtoSchema.parse(val)),
        ),
      );
  }
  getBlog(id: string) {
    return this.httpClient.get(`/api/blog/id/${id}`).pipe(
      map((result) => blogDtoSchema.parse(result)),
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          void this.router.navigateByUrl("/");
        }
        throw err;
      }),
    );
  }
  createBlog(data: BlogValues) {
    return this.httpClient
      .post(
        "/api/blog",
        this.toFormData(createBlogSchema.parse({ ...data, image: null })),
      )
      .pipe(map((result) => blogDtoSchema.parse(result)));
  }
  updateBlog(data: BlogValues, blogId: string | null): Observable<BlogDto> {
    if (!blogId) {
      throw new Error("Blog can only be updated from its edit page");
    }
    return this.httpClient
      .patch(
        `/api/blog/${blogId}`,
        this.toFormData(updateBlogSchema.parse(data)),
      )
      .pipe(map((result) => blogDtoSchema.parse(result)));
  }

  deleteBlog(postId: string) {
    return this.httpClient.delete(`/api/blog/${postId}`);
  }

  // We need to set authentication headers manually when calls are
  // made indirectly within guards or resolvers on the server side
  protected getAuthHeaders(authHeader?: string) {
    let headers = new HttpHeaders();
    if (authHeader) {
      headers = headers.set("Authorization", `Bearer ${authHeader}`);
    }
    return headers;
  }

  protected toFormData<Data extends Record<string, unknown>>(data: Data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      const isBlob = value instanceof Blob;
      if (typeof value !== "string" && !isBlob) {
        return;
      }
      formData.set(key, value);
    });
    return formData;
  }
}
