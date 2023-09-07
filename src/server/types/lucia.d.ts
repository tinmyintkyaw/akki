/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../lucia.ts").Auth;
  type DatabaseUserAttributes = {
    username: string;
    searchKeyId: number;
    searchKey: string;
  };
  type DatabaseSessionAttributes = {
    editorKey: string;
  };
}
