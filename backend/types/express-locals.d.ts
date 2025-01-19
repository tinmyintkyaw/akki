import { auth } from "@/auth/better-auth.ts";

declare global {
  namespace Express {
    interface Locals {
      // https://www.better-auth.com/docs/concepts/typescript#inferring-types
      session: typeof auth.$Infer.Session;
      searchToken: string;
    }
  }
}
