import type { Insertable, Kysely } from "kysely";

import { AuthService } from "../../server/services/auth.service";
import { BlogService } from "../../server/services/blog.service";
import { UUIDv5 } from "../helpers/v5";
import type { Blog, DB } from "../types";

const USERS = [
  { name: "John Doe", username: "johnDoe", password: "johnDoe-password" },
  { name: "Jane Doe", username: "janeDoe", password: "janeDoe-password" },
] as const;

const BLOGS = {
  johnDoe: [
    {
      title: "My first blog",
      content:
        "I think I have a lot of smart things to say, so I'll just go ahead and say them and people will listen and they will rejoice and I will be the next Tolstoy most likely, most definitely.",
      created_at: new Date("2025-06-01T12:00:00"),
    },
    {
      title: "Well, I'm out of ideas!",
      content: "Nobody said that it would be this hard.",
      created_at: new Date("2025-06-02T08:32:00"),
    },
  ],
  janeDoe: [
    {
      title: "I have to start somewhere!",
      content: "I will write about important things. I guess?",
      created_at: new Date("2025-06-03T:10:10:00"),
    },
  ],
} satisfies Record<
  string,
  (Pick<Insertable<Blog>, "content" | "title"> & { created_at: Date })[]
>;

export async function seed(db: Kysely<DB>): Promise<void> {
  const userService = new AuthService(db);
  const blogService = new BlogService(db);
  await db.deleteFrom("blog").execute();
  await db.deleteFrom("user").execute();
  await db.deleteFrom("invalidated_sessions").execute();

  // Ensure ids are consistent
  const userV5 = new UUIDv5("user");
  const blogV5 = new UUIDv5("blog");

  await Promise.all(
    USERS.map(async (user) => {
      await userService.generateUser(user);
      await db
        .updateTable("user")
        .set({ id: userV5.generate(user.username) })
        .where("username", "=", user.username)
        .execute();
    })
  );

  await Promise.all(
    Object.entries(BLOGS).map(async ([author, blogs]) => {
      return await Promise.all(
        blogs.map(async (blog, i) => {
          const { id } = await blogService.createBlog({
            ...blog,
            author: userV5.generate(author),
          });
          await db
            .updateTable("blog")
            .set({ id: blogV5.generate(userV5.generate(author), i) })
            .where("id", "=", id)
            .execute();
        })
      );
    })
  );
}
