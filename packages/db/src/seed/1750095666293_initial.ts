import argon2 from "argon2";
import type { Insertable, Kysely } from "kysely";

import { add } from "date-fns";
import { UUIDv5 } from "../helpers/v5";
import type { Blog, DB } from "../types";

type BlogEntry = Record<
  string,
  (Pick<Insertable<Blog>, "content" | "title"> & { created_at: Date })[]
>;

export const USERS = [
  { name: "John Doe", username: "johnDoe", password: "johnDoe-password" },
  { name: "Alice Jane", username: "aliceJane", password: "aliceJane-password" },
] as const;

export const lorem =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente veniam ut quam ducimus repellendus. Vitae quas maxime quibusdam atque magnam suscipit eligendi mollitia quisquam? Quia minima reiciendis provident dignissimos pariatur!\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla perspiciatis ab sit? Voluptates suscipit placeat eligendi minus corporis, est reiciendis aliquid iste dolorem quae, a, temporibus maiores unde ut aut?\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, eum sit minima unde ullam, magnam aspernatur perspiciatis, velit voluptatem corporis mollitia. Animi natus nisi culpa rem. Tempore dolores magni cumque!";
const baseDate = new Date("2025-06-01T12:00:00");
const BLOGS = ["johnDoe", "aliceJane"].reduce<BlogEntry>((acc, curr) => {
  acc[curr] = [
    ...Iterator.from(Array(25))
      .map((_, i) => ({
        title: `${USERS.find(({ username }) => username === curr)?.name} - ${i + 1}`,
        content: lorem,
        created_at: add(baseDate, {
          days: i + 1,
          minutes: curr === "johnDoe" ? 1 : 2,
        }),
      }))
      .toArray(),
  ];
  return acc;
}, {});

const toSummary = (val: string) => {
  const trimmed = val.replaceAll(/\n+/g, " ").trim();
  return trimmed.length <= 300
    ? trimmed
    : [trimmed.slice(0, 297), "..."].join("");
};

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
          password: await argon2.hash(user.password),
          username: user.username,
        })
        .execute();
    }),
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
              author_id: authorId,
              content: blog.content,
              summary: toSummary(blog.content),
              title: blog.title,
              id: blogV5.generate(authorId, i),
              created_at,
              updated_at: created_at,
            })
            .execute();
        }),
      );
    }),
  );
}
