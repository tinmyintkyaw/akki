import { Generated, JSONColumnType } from "kysely";

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  userSettings: UserSettingsTable;
  space: SpaceTable;
  spaceMembers: SpaceMembersTable;
  page: PageTable;
  tag: TagTable;
  pageTag: PageTagTable;
  pinnedPage: PinnedPageTable;
  pinnedTag: PinnedTagTable;
  file: FileTable;
}

export interface UserTable {
  id: Generated<string>;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface SessionTable {
  id: Generated<string>;
  token: string;
  expiresAt: Generated<Date>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: string;
}

export interface AccountTable {
  id: Generated<string>;
  accountId: string;
  providerId: string;
  accressToken: string | null;
  refreshToken: string | null;
  accressTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: string;
}

export interface VerificationTable {
  id: Generated<string>;
  identifier: string;
  value: string;
  expiresAt: Generated<Date>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface UserSettingsTable {
  id: Generated<string>;
  settings: JSONColumnType<{}>;
}

export interface SpaceTable {
  id: Generated<string>;
  name: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface SpaceMembersTable {
  spaceId: string;
  userId: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  role: "admin" | "member";
}

export interface PageTable {
  id: Generated<string>;
  name: string;
  ydoc: Buffer;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Date | null;
  createdBy: string;
  isPinned: Generated<boolean>;
  spaceId: string;
}

export interface TagTable {
  id: Generated<string>;
  name: string;
  spaceId: string;
}

export interface PageTagTable {
  pageId: string;
  tagId: string;
  createdAt: Generated<Date>;
}

export interface FileTable {
  id: Generated<string>;
  filename: string;
  extension: string | undefined;
  createdAt: Generated<Date>;
  createdBy: string;
  spaceId: string;
}
