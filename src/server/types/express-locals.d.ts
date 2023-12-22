import { Session } from "lucia";

declare global {
  namespace Express {
    interface Locals {
      session?: Session;
    }
  }
}
