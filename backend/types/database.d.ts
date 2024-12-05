import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  User: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };

  Session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
  };

  Account: {
    id: string;
    userId: string;
    accountId: string;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: Date;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
  };

  Verification: {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };

  Page: {
    id: string;
    pageName: ColumnType<string, string | undefined, string | undefined>;
    path: string;
    ydoc: Buffer;
    isStarred: ColumnType<boolean, boolean | undefined, boolean | undefined>;
    createdAt: ColumnType<Date, never, never>;
    modifiedAt: ColumnType<Date, never, Date>;
    accessedAt: ColumnType<Date, never, Date>;
    deletedAt: Date | null;
    userId: string;
  };

  File: {
    id: string;
    extension: string;
    fileName: string;
    userId: string;
    pageId: string;
  };

  Setting: {
    id: string;
    editorWidth: number;
    userId: string;
  };

  GlobalVariable: {
    id: Generated<number>;
    searchKeyId: string;
    searchKeyValue: string;
  };
}

export type User = Selectable<Database["User"]>;
export type NewUser = Insertable<Database["User"]>;
export type UpdateUser = Updateable<Database["User"]>;

export type Page = Selectable<Database["Page"]>;
export type NewPage = Insertable<Database["Page"]>;
export type UpdatePage = Updateable<Database["Page"]>;

export type File = Selectable<Database["File"]>;
export type NewFile = Insertable<Database["File"]>;
export type UpdateFile = Updateable<Database["File"]>;

export type Setting = Selectable<Database["Setting"]>;
export type NewSetting = Insertable<Database["Setting"]>;
export type UpdateSetting = Updateable<Database["Setting"]>;

export type GlobalVariable = Selectable<Database["GlobalVariable"]>;
export type NewGlobalVariable = Insertable<Database["GlobalVariable"]>;
export type UpdateGlobalVariable = Updateable<Database["GlobalVariable"]>;
