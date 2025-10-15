import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BlogPreviewServiceToken } from "../../../services/blog-preview.service";
import { BlogPreviewComponent } from "../../Organisms/BlogPreview/blog-preview.component";
import { BlogPreviewTemplate } from "../../Templates/BlogPreviews/blog-previews.component";
import { PageWrapperWithLoadingComponent } from "../../Templates/PageWrapperWithLoading/page-wrapper-with-loading.component";
import { UserBlogsPreviewService } from "./user-blogs.service";

@Component({
  selector: "app-user-blogs",
  templateUrl: "../../Templates/BlogPreviews/blog-previews.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BlogPreviewServiceToken, useClass: UserBlogsPreviewService },
  ],
  imports: [BlogPreviewComponent, PageWrapperWithLoadingComponent],
})
export class HomepageComponent extends BlogPreviewTemplate {}
