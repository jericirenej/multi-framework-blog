import db from "@/db/client-singleton";
import type { Blog, DB } from "@/db/types";
import { HTTPException } from "hono/http-exception";
import type { Insertable, Kysely, Updateable } from "kysely";
import { v7 } from "uuid";
import type { BlogDto } from "../schemas";

type EvaluateBlogArgs = { postId: string } & (
  | { onlyAuthors: true; author: string }
  | { onlyAuthors?: false }
);

export class BlogService {
  constructor(protected db: Kysely<DB>) {}

  async getBlogs(): Promise<BlogDto[]> {
    return this.blogAndAuthorQuery.execute();
  }

  async getBlog(postId: string): Promise<BlogDto> {
    return this.evaluateBlog({ postId });
  }
  async getBlogsByUser(author: string): Promise<BlogDto[]> {
    return this.blogAndAuthorQuery
      .where("user.username", "=", author)
      .execute();
  }

  async createBlog(
    data: Pick<Insertable<Blog>, "content" | "title" | "author_id" | "image">
  ): Promise<BlogDto> {
    const createdAt = new Date();
    const id = v7();
    const result = await this.db
      .insertInto("blog")
      .values({
        author_id: data.author_id,
        content: data.content,
        id,
        created_at: createdAt.getTime(),
        updated_at: createdAt.getTime(),
        image: data.image,
        title: data.title,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      ...result,
      author_name: (
        await this.db
          .selectFrom("user")
          .select("name")
          .where("id", "=", data.author_id)
          .executeTakeFirstOrThrow()
      ).name,
    };
  }

  async updateBlog({
    id,
    ...data
  }: Pick<Updateable<Blog>, "content" | "title" | "image"> & {
    id: string;
    author_id: string;
  }) {
    const updated_at = new Date().getTime();
    await this.evaluateBlog({
      postId: id,
      author: data.author_id,
      onlyAuthors: true,
    });
    return await this.db
      .updateTable("blog")
      .set({ ...data, updated_at })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async deleteBlog(args: Record<"postId" | "author", string>) {
    const { id } = await this.evaluateBlog({ ...args, onlyAuthors: true });
    return await this.db
      .deleteFrom("blog")
      .where("id", "=", id)
      .executeTakeFirst();
  }

  protected async evaluateBlog(args: EvaluateBlogArgs): Promise<BlogDto> {
    const blog = await this.blogAndAuthorQuery
      .where("blog.id", "=", args.postId)
      .executeTakeFirst();
    if (!blog) {
      throw new HTTPException(404, { message: "Blog not found" });
    }
    if (args.onlyAuthors && args.author !== blog.author_id) {
      throw new HTTPException(403, {
        message: "Blog can only be deleted by its author",
      });
    }

    return blog;
  }

  protected get blogAndAuthorQuery() {
    return this.db
      .selectFrom("blog")
      .selectAll("blog")
      .innerJoin("user", "blog.author_id", "user.id")
      .select(["user.name as author_name"]);
  }
}
const blogService = new BlogService(db);
export default blogService;
