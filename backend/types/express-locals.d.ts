import { auth } from "@/auth/better-auth.ts";
import { Key } from "meilisearch";

declare global {
  namespace Express {
    interface Locals {
      // https://www.better-auth.com/docs/concepts/typescript#inferring-types
      session: typeof auth.$Infer.Session;
      defaultSearchKey: Key;
    }
  }
}
