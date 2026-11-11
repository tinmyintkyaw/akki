import { Generated, JSONColumnType } from "kysely";

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  organization: OrganizationTable;
  member: MemberTable;
  invitation: InvitationTable;
  userSettings: UserSettingsTable;
  page: PageTable;
  tag: TagTable;
  pageTag: PageTagTable;
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
  activeOrganizationId: string | null;
  activeTeamId: string | null;
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

export interface OrganizationTable {
  id: Generated<string>;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  createdAt: Generated<Date>;
}

export interface MemberTable {
  id: Generated<string>;
  userId: string;
  organizationId: string;
  role: string;
  createdAt: Generated<Date>;
}

export interface InvitationTable {
  id: Generated<string>;
  email: string;
  inviterId: string;
  organizationId: string;
  role: string | null;
  status: string;
  createdAt: Generated<Date>;
  expiresAt: Generated<Date>;
}

export interface UserSettingsTable {
  id: Generated<string>;
  settings: JSONColumnType<{}>;
}

export interface PageTable {
  id: Generated<string>;
  name: string;
  ydoc: Buffer;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: Date | null;
  authorId: string;
  isPinned: Generated<boolean>;
  organizationId: string;
}

export interface TagTable {
  id: Generated<string>;
  name: string;
  organizationId: string;
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
  organizationId: string;
}
