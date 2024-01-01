/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../configs/lucia.js").Auth;
  type DatabaseUserAttributes = {
    name: string;
    username?: string;
    image?: string;
    email?: string;
    email_verified?: boolean;
  };
  type DatabaseSessionAttributes = {
    scoped_search_key: string;
  };
}
