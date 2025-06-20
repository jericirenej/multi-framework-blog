import { Hono } from "hono";
import blogService from "../../../services/blog.service";
import { authMiddleware, routeValidator } from "../middleware";
import { createBlogSchema, updateBlogSchema } from "../schemas";

const blog = new Hono()
  .get("all", async (ctx) => {
    return ctx.json(await blogService.getBlogs());
  })
  .get("id/:postId", async (ctx) => {
    return ctx.json(await blogService.getBlog(ctx.req.param("postId")));
  })
  .get("author/:username", async (ctx) => {
    return ctx.json(
      await blogService.getBlogsByUser(ctx.req.param("username"))
    );
  })
  .post(
    "/",
    authMiddleware,
    routeValidator("form", createBlogSchema, { statusCode: 400 }),
    async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...rest } = ctx.req.valid("form");
      const result = await blogService.createBlog({
        ...rest,
        author: ctx.get("parsed").sub,
      });
      return ctx.json(result, 201);
    }
  )
  .patch(
    ":postId",
    authMiddleware,
    routeValidator("form", updateBlogSchema, { statusCode: 400 }),
    async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...rest } = ctx.req.valid("form");

      const result = await blogService.updateBlog({
        ...rest,
        author: ctx.get("parsed").sub,
        id: ctx.req.param("postId"),
      });
      return ctx.json(result, 200);
    }
  )
  .delete(":postId", authMiddleware, async (ctx) => {
    const postId = ctx.req.param("postId");
    const result = await blogService.deleteBlog({
      postId,
      author: ctx.get("parsed").sub,
    });
    return ctx.text(result.numDeletedRows.toString(), 200);
  });

export default blog;
