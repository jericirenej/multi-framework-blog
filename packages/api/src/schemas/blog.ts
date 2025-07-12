import { z } from "zod/v4";

export const createBlogSchema = z
  .object({
    content: z.string(),
    title: z.string(),
    image: z
      .file()
      .min(1)
      .max(3 * 1024 ** 2)
      .mime(["image/jpeg", "image/webp", "image/png"])
      .nullish(),
  })
  .strict();

export const updateBlogSchema = createBlogSchema
  .strict()
  .partial()
  .check((ctx) => {
    if (Object.keys(ctx).length === 0) {
      ctx.issues.push({
        code: "too_small",
        minimum: 1,
        origin: "object",
        message: "At least one blog property must be supplied for valid update",
        input: ctx.value,
      });
    }
  });

export const blogDtoSchema = createBlogSchema.omit({ image: true }).extend({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  author_id: z.string(),
  author_name: z.string(),
  image: z.string().nullable(),
});

export type CreateBlogDto = z.infer<typeof createBlogSchema>;
export type UpdateBlogDto = z.infer<typeof updateBlogSchema>;
export type BlogDto = z.infer<typeof blogDtoSchema>;
