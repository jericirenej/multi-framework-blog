import { SUMMARY_LENGTH_LIMIT } from "../constants";
import type { BlogDto } from "../schemas";

const date = new Date("2025-06-01T12:00:00");
const content =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente veniam ut quam ducimus repellendus. Vitae quas maxime quibusdam atque magnam suscipit eligendi mollitia quisquam? Quia minima reiciendis provident dignissimos pariatur!\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla perspiciatis ab sit? Voluptates suscipit placeat eligendi minus corporis, est reiciendis aliquid iste dolorem quae, a, temporibus maiores unde ut aut?\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, eum sit minima unde ullam, magnam aspernatur perspiciatis, velit voluptatem corporis mollitia. Animi natus nisi culpa rem. Tempore dolores magni cumque!";

export const exampleBlog: BlogDto = {
  author_id: "johnDoe",
  author_name: "John Doe",
  content,
  summary: [
    content
      .replaceAll(/\n+/g, " ")
      .trim()
      .slice(0, SUMMARY_LENGTH_LIMIT - 3),
    "...",
  ].join(""),
  created_at: date.getTime(),
  updated_at: date.getTime(),
  id: "blog-id",
  image: null,
  title: "Example title",
};
