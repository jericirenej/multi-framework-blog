import type { BlogDto } from "@/api/schemas";

type CreateBlogParams = {
  authorId: string;
  authorName: string;
  date?: Date;
  blogId?: string;
};

export const createBlog = ({
  authorId,
  authorName,
  blogId,
  date = new Date("2025-06-06T12:00:00"),
}: CreateBlogParams): BlogDto => {
  const baseTime = date.getTime();
  const baseBlogTime = { created_at: baseTime, updated_at: baseTime };

  const content = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam voluptatum omnis impedit, excepturi animi nobis maxime ratione ut placeat est consectetur possimus sunt amet tempore tempora magnam quos fugiat rem!
Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum nostrum eos, saepe aut consectetur molestias, aliquam cumque ex repellat doloremque nisi quaerat mollitia enim recusandae eaque non natus odio qui.
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut quisquam voluptatum quasi praesentium dolor assumenda rerum animi blanditiis eos, sint nam quas sequi voluptate. Similique totam magnam maiores magni aliquam!
Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta sed eaque, illo architecto voluptas praesentium doloribus ipsum recusandae provident esse quia, nemo harum rerum magni hic delectus? Fugit, voluptatum eius!
Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae repudiandae praesentium quo harum eius ratione tempore blanditiis? Consectetur exercitationem quo iure delectus explicabo vitae consequuntur, cumque autem, amet error voluptate?`;

  return {
    author_id: authorId,
    author_name: authorName,
    content,
    summary: [content.replaceAll(/\n+/g, " ").trim().slice(0, 297), "..."].join(
      "",
    ),
    id: blogId ?? "post-id",
    image: null,
    title: "Title of an interesting post",
    ...baseBlogTime,
  };
};
