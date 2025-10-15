import { RenderMode, type ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  { path: "blog/create", renderMode: RenderMode.Server },
  { path: "blog/personal", renderMode: RenderMode.Server },
  {
    path: "blog/:blogId",
    renderMode: RenderMode.Server,
  },
  { path: "blog/edit/:blogId", renderMode: RenderMode.Server },
  { path: "login", renderMode: RenderMode.Server },
  {
    path: "",
    renderMode: RenderMode.Server,
  },
  { path: "404", renderMode: RenderMode.Prerender },
  { path: "**", renderMode: RenderMode.Server, status: 301 },
];
