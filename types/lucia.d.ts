/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../src/server/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {
    // username: string;
  };
}
