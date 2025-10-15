import { type BlogDto } from "@/api/schemas";
import { inject, Injectable } from "@angular/core";
import { Validators, type FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { delay, map, of, type Observable } from "rxjs";
import { ApiService } from "../../../services/api.service";
import { AbstractFormService } from "../../../services/form.service";

function buildForm(
  fb: FormBuilder,
  value: Partial<Pick<BlogDto, "content" | "title">> = {
    content: "",
    title: "",
  },
) {
  return fb.group({
    title: fb.control(value.title, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    content: fb.control(value.content, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });
}
export type BlogForm = ReturnType<typeof buildForm>;
export type BlogValues = ReturnType<BlogForm["getRawValue"]>;

@Injectable()
export abstract class AbstractBlogFormService extends AbstractFormService<BlogForm> {
  protected apiService = inject(ApiService);
  override defaultErrorMessage = "Updating blog failed";
  buildForm(initialValues: BlogValues) {
    return buildForm(this.fb, initialValues);
  }
  protected abstract override submitHandler(): Observable<BlogValues>;

  get title() {
    return this.form.controls.title;
  }
  get content() {
    return this.form.controls.content;
  }
}

@Injectable()
export class EditBlogFormService extends AbstractBlogFormService {
  protected activatedRoute = inject(ActivatedRoute);
  protected submitHandler() {
    return this.apiService.updateBlog(
      this.form.getRawValue(),
      this.activatedRoute.snapshot.paramMap.get("blogId"),
    );
  }
}

@Injectable()
export class CreateBlogFormService extends AbstractBlogFormService {
  protected override submitHandler(): Observable<BlogValues> {
    return this.apiService.createBlog(this.form.getRawValue());
  }
}

export const mockApiService = (shouldSucceed = true, updatedBlog: BlogDto) => {
  const handler = () =>
    of([]).pipe(
      delay(1000),
      map(() => {
        if (shouldSucceed) return updatedBlog;
        throw new Error("Something went wrong");
      }),
    );
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateBlog(..._parameters: Parameters<ApiService["updateBlog"]>) {
      return handler();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createBlog(..._parameters: Parameters<ApiService["createBlog"]>) {
      return handler();
    },
  };
};
