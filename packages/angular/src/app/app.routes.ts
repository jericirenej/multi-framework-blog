import { inject } from "@angular/core";
import { type Routes } from "@angular/router";
import blogResolver from "../resolvers/blog.resolver";
import {
  authenticationStateGuard,
  authGuard,
  loginGuard,
} from "./guards/is-authenticated.guard";
import { AuthenticationService } from "./services/is-authenticated.service";

export const routes: Routes = [
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivateChild: [authenticationStateGuard],
    children: [
      {
        path: "",
        title: "Blog overview",
        loadComponent: () =>
          import("./components/Pages/Homepage/homepage.component").then(
            (im) => im.HomepageComponent,
          ),
      },
      {
        path: "blog/personal",
        canActivate: [authGuard],
        title: () => {
          const name = inject(AuthenticationService).me()?.name;
          if (!name) {
            return "My blogs";
          }
          return `Blogs: ${name}`;
        },
        loadComponent: () =>
          import("./components/Pages/UserBlogs/user-blogs.component").then(
            (im) => im.HomepageComponent,
          ),
      },
      {
        path: "blog/create",
        pathMatch: "full",
        canMatch: [authGuard],
        title: "Create new blog post",
        loadComponent: () =>
          import(
            "./components/Pages/CreateBlog/create-blog-page.component"
          ).then((im) => im.CreateBlogPageComponent),
      },
      {
        path: "blog/edit/:blogId",
        canActivate: [authGuard],
        resolve: { blog: blogResolver },
        loadComponent: () =>
          import("./components/Pages/EditBlog/edit-blog-page.component").then(
            (im) => im.CreateBlogPageComponent,
          ),
      },
      {
        path: "blog/:blogId",

        loadComponent: () =>
          import("./components/Pages/Blog/blog-page.component").then(
            (im) => im.BlogPageComponent,
          ),
      },
      {
        path: "login",
        title: "Login",
        canMatch: [loginGuard],
        loadComponent: () =>
          import("./components/Pages/LoginPage/login-page.component").then(
            (im) => im.LoginPageComponent,
          ),
      },
      {
        path: "404",
        title: "Not found",
        loadComponent: () =>
          import("./components/Pages/404/404-page.component").then(
            (im) => im.NotFoundPage,
          ),
      },
      { path: "**", redirectTo: "404" },
    ],
  },
];
