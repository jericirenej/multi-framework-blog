import type { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("username", "text", (col) => col.notNull().unique())
    .addColumn("password", "text", (col) => col.notNull().unique())
    .addColumn("name", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("blog")
    .addColumn("id", "text", (col) => col.primaryKey().notNull())
    .addColumn("author_id", "text", (col) =>
      col.notNull().references("user.id"),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("summary", "text", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("created_at", "integer", (col) =>
      col.notNull().defaultTo("unixepoch()"),
    )
    .addColumn("updated_at", "integer", (col) =>
      col.notNull().defaultTo("unixepoch()"),
    )
    .execute();

  await db.schema
    .createTable("invalidated_sessions")
    .addColumn("jwt_hash", "text", (col) => col.primaryKey().notNull())
    .addColumn("exp", "integer", (col) => col.notNull())
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>) {
  await db.schema.dropTable("blog").execute();
  await db.schema.dropTable("invalidated_sessions").execute();
  await db.schema.dropTable("user").execute();
}
