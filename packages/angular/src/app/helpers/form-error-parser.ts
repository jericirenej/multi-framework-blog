import type { ValidationErrors } from "@angular/forms";

const errHasMessage = (obj: unknown): obj is { message: string } => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "message" in obj &&
    typeof obj["message"] === "string"
  );
};
export const parseErrors = (
  errors: ValidationErrors | null | undefined,
): string | undefined => {
  if (!errors) return undefined;
  return Object.entries(errors).reduce((message, [name, description]) => {
    message += ` ${parseError(name, description)}`;
    return message.trim();
  }, "");
};
export const parseError = (key: string, obj: unknown): string => {
  if (errHasMessage(obj)) {
    return obj["message"];
  }
  if (key === "required") {
    return "Required.";
  }
  if (key === "minlength") {
    const { requiredLength } = obj as Record<
      "requiredLength" | "actualLength",
      number
    >;
    return `${requiredLength} characters minimum.`;
  }
  return `Invalid ${key}.`;
};
