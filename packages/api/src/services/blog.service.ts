import db from "@/db/client-singleton";
import type { Blog, DB } from "@/db/types";
import { HTTPException } from "hono/http-exception";
import type { Insertable, Kysely, Updateable } from "kysely";
import { v7 } from "uuid";
import { SUMMARY_LENGTH_LIMIT } from "../constants";
import {
  blogDtoSchema,
  blogSummaryDtoSchema,
  type BlogDto,
  type BlogSummaryDto,
} from "../schemas";

type EvaluateBlogArgs = { postId: string } & (
  | { onlyAuthors: true; author: string }
  | { onlyAuthors?: false }
);

export class BlogService {
  readonly limitMax = 25;
  constructor(protected db: Kysely<DB>) {}

  async getBlogs(limit = this.limitMax, offset = 0): Promise<BlogSummaryDto[]> {
    return this.parseBlogsToSummary(
      this.blogAndAuthorQuery
        .limit(Math.min(limit, this.limitMax))
        .offset(offset)
        .execute(),
    );
  }
  async getBlogsIds(): Promise<{ id: string }[]> {
    return await this.db.selectFrom("blog").select("id").execute();
  }

  async getBlog(postId: string): Promise<BlogDto> {
    return this.evaluateBlog({ postId });
  }
  async getBlogsByUser(
    author: string,
    limit = this.limitMax,
    offset = 0,
  ): Promise<BlogSummaryDto[]> {
    return this.parseBlogsToSummary(
      this.blogAndAuthorQuery
        .where("user.username", "=", author)
        .limit(Math.min(limit, this.limitMax))
        .offset(offset)
        .execute(),
    );
  }

  async createBlog(
    data: Pick<Insertable<Blog>, "content" | "title" | "author_id" | "image">,
  ): Promise<BlogDto> {
    const createdAt = new Date();
    const id = v7();
    const result = await this.db
      .insertInto("blog")
      .values({
        author_id: data.author_id,
        content: data.content,
        summary: this.contentToSummary(data.content),
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
      author_name: await this.getAuthorName(data.author_id),
    };
  }

  async updateBlog({
    id,
    ...data
  }: Pick<Updateable<Blog>, "content" | "title" | "image"> & {
    id: string;
    author_id: string;
  }): Promise<BlogDto> {
    const updated_at = new Date().getTime();
    const { summary: oldSummary } = await this.evaluateBlog({
      postId: id,
      author: data.author_id,
      onlyAuthors: true,
    });
    const updatedData = {
      ...data,
      summary: data.content ? this.contentToSummary(data.content) : oldSummary,
      updated_at,
    };
    const updatedBlog = await this.db
      .updateTable("blog")
      .set(updatedData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return blogDtoSchema.parse({
      ...updatedBlog,
      author_name: await this.getAuthorName(updatedBlog.author_id),
    });
  }

  async deleteBlog(args: Record<"postId" | "author", string>) {
    const { id } = await this.evaluateBlog({ ...args, onlyAuthors: true });
    return await this.db
      .deleteFrom("blog")
      .where("id", "=", id)
      .executeTakeFirst();
  }

  contentToSummary(val: string): string {
    const trimmed = val.replaceAll(/\n+/g, " ").trim();
    return trimmed.length <= SUMMARY_LENGTH_LIMIT
      ? trimmed
      : [trimmed.slice(0, SUMMARY_LENGTH_LIMIT - 3), "..."].join("");
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
        message: "Blog can only be modified by its author",
      });
    }

    return blog;
  }
  protected async getAuthorName(author_id: string) {
    return (
      await this.db
        .selectFrom("user")
        .select("name")
        .where("id", "=", author_id)
        .executeTakeFirstOrThrow()
    ).name;
  }
  protected get blogAndAuthorQuery() {
    return this.db
      .selectFrom("blog")
      .selectAll("blog")
      .innerJoin("user", "blog.author_id", "user.id")
      .select(["user.name as author_name"])
      .orderBy("created_at", "desc");
  }
  protected async parseBlogsToSummary(
    promisedBlogs: Promise<BlogDto[]>,
  ): Promise<BlogSummaryDto[]> {
    return (await promisedBlogs).map((blog) =>
      blogSummaryDtoSchema.parse(blog),
    );
  }
}
const blogService = new BlogService(db);
export default blogService;
