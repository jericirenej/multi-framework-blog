import { $, ProcessOutput } from "zx";
try {
  await $`echo "Running eslint..."`;
  console.time("Eslint time");
  await $`bun run --filter "*" lint`;
  console.timeEnd("Eslint time");

  await $`echo "Running ts check..."`;
  console.time("TS time");
  await $`bunx tsgo --project tsconfig.json`;
  console.timeEnd("TS time");
} catch (err) {
  if (err instanceof ProcessOutput) {
    console.error(err.text());
  } else {
    console.error(err);
  }
}
