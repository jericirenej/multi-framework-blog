import type { Insertable, Kysely } from "kysely";

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
      created_at: new Date("2025-06-03T10:10:00"),
    },
  ],
} satisfies Record<
  string,
  (Pick<Insertable<Blog>, "content" | "title"> & { created_at: Date })[]
>;

export async function seed(db: Kysely<DB>): Promise<void> {
  await db.deleteFrom("blog").execute();
  await db.deleteFrom("user").execute();
  await db.deleteFrom("invalidated_sessions").execute();

  // Ensure ids are consistent
  const userV5 = new UUIDv5("user");
  const blogV5 = new UUIDv5("blog");

  await Promise.all(
    USERS.map(async (user) => {
      await db
        .insertInto("user")
        .values({
          id: userV5.generate(user.username),
          name: user.name,
          password: await Bun.password.hash(user.password),
          username: user.username,
        })
        .execute();
    })
  );

  await Promise.all(
    Object.entries(BLOGS).map(async ([author, blogs]) => {
      return await Promise.all(
        blogs.map(async (blog, i) => {
          const authorId = userV5.generate(author);
          const created_at = blog.created_at.getTime();
          await db
            .insertInto("blog")
            .values({
              author: authorId,
              content: blog.content,
              title: blog.title,
              id: blogV5.generate(authorId, i),
              created_at,
              updated_at: created_at,
            })
            .execute();
        })
      );
    })
  );
}
