import { Generated } from "kysely";
import { KeySchema } from "typesense";

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  systemSettings: SystemSettingsTable;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionTable {
  id: Generated<string>;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VerificationTable {
  id: Generated<string>;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSettingsTable {
  id: number;
  typesenseSearchKey: KeySchema | null;
}

export interface SpaceTable {
  id: Generated<string>;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpaceMembersTable {
  spaceId: string;
  userId: string;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

export interface PageTable {
  id: Generated<string>;
  name: string;
  ydoc: Buffer;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string;
  isPinned: boolean;
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
  createdAt: Date;
}

export interface PinnedPageTable {
  pageId: string;
  userId: string;
  createdAt: Date;
}

export interface PinnedTagTable {
  tagId: string;
  userId: string;
  createdAt: Date;
}

export interface FileTable {
  id: Generated<string>;
  filename: string;
  extension: string | undefined;
  createdAt: Date;
  createdBy: string;
  spaceId: string;
}
