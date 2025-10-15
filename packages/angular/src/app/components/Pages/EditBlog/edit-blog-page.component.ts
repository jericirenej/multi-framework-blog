import type { BlogDto } from "@/api/schemas";
import { Component, effect, inject, input } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import navigateOnSuccess from "../../../helpers/navigate-on-success";
import type { ResultStatus } from "../../../services/form.service";
import { BlogFormComponent } from "../../Organisms/BlogForm/blog-form.component";
import {
  AbstractBlogFormService,
  EditBlogFormService,
} from "../../Organisms/BlogForm/blog-form.service";
import { PageWrapperComponent } from "../../Templates/PageWrapper/page-wrapper.component";

@Component({
  selector: "app-edit-blog-page",
  providers: [
    { provide: AbstractBlogFormService, useClass: EditBlogFormService },
  ],
  imports: [PageWrapperComponent, BlogFormComponent],
  template: `
    @let data = blog();
    <app-page-wrapper pageTitle="Create blog post">
      <app-blog-form
        defaultErrorMessage="Error while updating blog post"
        submitLabel="Update blog post"
        successLabel="Blog post updated"
        [data]="data"
        (status)="handleStatus($event)"
        (goBack)="handleGoBack()"
      />
    </app-page-wrapper>
  `,
})
export class CreateBlogPageComponent {
  readonly blogId = input<string>();
  readonly blog = input<BlogDto>();
  protected router = inject(Router);
  protected readonly titleService = inject(Title);
  protected handleStatus(result: ResultStatus) {
    navigateOnSuccess({
      router: this.router,
      result,
      path: `/blog/${this.blogId()}`,
    });
  }
  protected handleGoBack() {
    void this.router.navigateByUrl("/");
  }

  constructor() {
    effect(() => {
      const title = this.blog()?.title;
      if (title !== undefined) {
        this.titleService.setTitle(`Edit: ${title}`);
      }
    });
  }
}
