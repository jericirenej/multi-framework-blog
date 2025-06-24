import db from "@/db/client-singleton.ts";
import type { Blog, DB } from "@/db/types.ts";
import { randomUUIDv7 } from "bun";
import { HTTPException } from "hono/http-exception";
import type { Insertable, Kysely, Selectable, Updateable } from "kysely";

type EvaluateBlogArgs = { postId: string } & (
  | { onlyAuthors: true; author: string }
  | { onlyAuthors?: false }
);

type BlogDto = Selectable<Blog>;

export class BlogService {
  constructor(protected db: Kysely<DB>) {}

  async getBlogs(): Promise<BlogDto[]> {
    return this.db.selectFrom("blog").selectAll().execute();
  }

  async getBlog(postId: string): Promise<BlogDto> {
    return this.evaluateBlog({ postId });
  }
  async getBlogsByUser(author: string): Promise<BlogDto[]> {
    return this.db
      .selectFrom("blog")
      .selectAll("blog")
      .innerJoin("user", "user.id", "blog.author")
      .where("user.username", "=", author)
      .execute();
  }

  async createBlog(
    data: Pick<Insertable<Blog>, "content" | "title" | "author" | "image">
  ): Promise<BlogDto> {
    const createdAt = new Date();
    const id = randomUUIDv7("hex", createdAt);
    return await this.db
      .insertInto("blog")
      .values({
        author: data.author,
        content: data.content,
        id,
        created_at: createdAt.getTime(),
        updated_at: createdAt.getTime(),
        image: data.image,
        title: data.title,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateBlog({
    id,
    ...data
  }: Pick<Updateable<Blog>, "content" | "title" | "image"> & {
    id: string;
    author: string;
  }) {
    const updated_at = new Date().getTime();
    await this.evaluateBlog({
      postId: id,
      author: data.author,
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

  protected async evaluateBlog(args: EvaluateBlogArgs) {
    const blog = await this.db
      .selectFrom("blog")
      .selectAll()
      .where("id", "=", args.postId)
      .executeTakeFirst();
    if (!blog) {
      throw new HTTPException(404, { message: "Blog not found" });
    }
    if (args.onlyAuthors && args.author !== blog.author) {
      throw new HTTPException(403, {
        message: "Blog can only be deleted by its author",
      });
    }
    return blog;
  }
}
const blogService = new BlogService(db);
export default blogService;
