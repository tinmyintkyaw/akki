/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../lucia.ts").Auth;
  type DatabaseUserAttributes = {
    name: string;
    username?: string;
    image?: string;
    email?: string;
    email_verified?: boolean;
  };
  type DatabaseSessionAttributes = {
    editorKey?: string;
    editorKeyExpires?: Date;
    typesenseKeyId: string;
    typesenseKeyValue: string;
  };
}
