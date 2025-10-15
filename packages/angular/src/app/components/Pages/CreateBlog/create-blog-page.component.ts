import { blogDtoSchema } from "@/api/schemas";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import navigateOnSuccess from "../../../helpers/navigate-on-success";
import type { ResultStatus } from "../../../services/form.service";
import { BlogFormComponent } from "../../Organisms/BlogForm/blog-form.component";
import {
  AbstractBlogFormService,
  CreateBlogFormService,
} from "../../Organisms/BlogForm/blog-form.service";
import { PageWrapperComponent } from "../../Templates/PageWrapper/page-wrapper.component";

@Component({
  selector: "app-create-blog-page",
  providers: [
    { provide: AbstractBlogFormService, useClass: CreateBlogFormService },
  ],
  imports: [PageWrapperComponent, BlogFormComponent],
  template: `
    <app-page-wrapper pageTitle="Create blog post">
      <app-blog-form
        defaultErrorMessage="Error while creating blog post"
        submitLabel="Create blog post"
        successLabel="Blog post created"
        (status)="handleStatus($event)"
        (goBack)="handleGoBack()"
      />
    </app-page-wrapper>
  `,
})
export class CreateBlogPageComponent {
  protected router = inject(Router);

  protected handleStatus(result: ResultStatus) {
    if (result.status !== "success") return;
    const { id } = blogDtoSchema.parse(result.value);
    navigateOnSuccess({ router: this.router, result, path: `/blog/${id}` });
  }

  protected handleGoBack() {
    void this.router.navigateByUrl("/");
  }
}
