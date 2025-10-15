import { z } from "zod/v4";
import { SUMMARY_LENGTH_LIMIT } from "../constants";

export const stringToNumberSchema = z.coerce
  .number()
  .int()
  .positive()
  .or(z.undefined())
  .catch(undefined);

export const createBlogSchema = z.object({
  content: z.string().min(5),
  title: z.string().min(3),
  image: z
    .file()
    .min(1)
    .max(3 * 1024 ** 2)
    .mime(["image/jpeg", "image/webp", "image/png"])
    .nullish(),
});

export const updateBlogSchema = createBlogSchema.partial().check((ctx) => {
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
  summary: z.string().max(SUMMARY_LENGTH_LIMIT),
  image: z.string().nullable(),
});

export const blogSummaryDtoSchema = blogDtoSchema.omit({ content: true });

export const blogIdDtoSchema = z.object({ id: z.string() });

export type CreateBlogDto = z.infer<typeof createBlogSchema>;
export type UpdateBlogDto = z.infer<typeof updateBlogSchema>;
export type BlogDto = z.infer<typeof blogDtoSchema>;
export type BlogSummaryDto = z.infer<typeof blogSummaryDtoSchema>;
export type BlogIdDto = z.infer<typeof blogIdDtoSchema>;
