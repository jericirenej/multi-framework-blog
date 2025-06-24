import { readFileSync } from "fs";
import { resolve } from "path";

const env = readFileSync(resolve(import.meta.dirname, "./.env"), "utf-8")
  .trim()
  .split(/\r?\n/)
  .reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr.split("=");
    if (key !== undefined && value !== undefined) {
      acc[key] = value;
    }

    return acc;
  }, {});

export default env;
