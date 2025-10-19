import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const tw = (
  strings: TemplateStringsArray,
  ...values: (string | number)[]
): string => {
  return twMerge(
    clsx(
      strings.reduce(
        (result, str, i) => result + str + (values[i]?.toString() ?? ""),
        "",
      ),
    ),
  );
};
export default tw;
