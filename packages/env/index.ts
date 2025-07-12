import { config } from "dotenv";
type ENV = { [key: string]: string | undefined } & Partial<
  Record<"CORS_ORIGIN" | "DATABASE_URL" | "API_SECRET", string>
>;
const env = () => {
  const processEnv = process.env as Partial<ENV>;

  if (process.env.CORS_ORIGIN) {
    return processEnv;
  }
  config({ path: "../../.env", quiet: true });
  return processEnv;
};
export default env;
