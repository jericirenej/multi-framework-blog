import { type BlogDto } from "@/api/schemas";
import { inject } from "@angular/core";
import { RedirectCommand, Router, type ResolveFn } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { ApiService } from "../app/services/api.service";
import { AuthenticationService } from "../app/services/is-authenticated.service";

const blogResolver: ResolveFn<RedirectCommand | BlogDto> = async (route) => {
  const router = inject(Router);
  const apiService = inject(ApiService);
  const authService = inject(AuthenticationService);
  const blogId = route.paramMap.get("blogId");
  const redirectToHomepage = () =>
    new RedirectCommand(router.parseUrl("/"), { replaceUrl: true });
  if (!blogId) {
    return redirectToHomepage();
  }
  const blog = await lastValueFrom(apiService.getBlog(blogId));
  if (blog.author_id !== authService.me()?.id) {
    return redirectToHomepage();
  }
  return blog;
};

export default blogResolver;
