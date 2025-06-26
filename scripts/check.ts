import { $, ProcessOutput } from "zx";
try {
  await $`echo "Running eslint..."`;
  console.time("Eslint finished");
  await $`pnpm run --filter "*" lint`;
  console.timeEnd("Eslint finished");

  await $`echo "Running ts check..."`;
  console.time("TS finished");
  await $`pnpm exec tsgo --project tsconfig.json`;
  console.timeEnd("TS finished");
} catch (err) {
  if (err instanceof ProcessOutput) {
    console.error(err.text());
  } else {
    console.error(err);
  }
}
