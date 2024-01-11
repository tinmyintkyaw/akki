import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  user: UserTable;
  key: KeyTable;
  page: PageTable;
  file: FileTable;
  setting: SettingTable;
  global_variable: GlobalVariableTable;
}

export interface UserTable {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  email: string | null;
  email_verified: boolean | null;
}

export interface KeyTable {
  id: string;
  hashed_password: string | null;
  user_id: string;
}

export interface PageTable {
  id: string;
  page_name: ColumnType<string, string | undefined, string | undefined>;
  path: string;
  ydoc: Buffer;
  is_starred: ColumnType<boolean, boolean | undefined, boolean | undefined>;
  created_at: ColumnType<Date, never, never>;
  modified_at: ColumnType<Date, never, Date>;
  accessed_at: ColumnType<Date, never, Date>;
  deleted_at: Date | null;
  user_id: string;
}

export interface FileTable {
  id: string;
  extension: string;
  file_name: string;
  user_id: string;
  page_id: string;
}

export interface SettingTable {
  id: string;
  editor_width: number;
  user_id: string;
}

export interface GlobalVariableTable {
  id: Generated<number>;
  search_key_id: string;
  search_key_value: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

export type Key = Selectable<KeyTable>;
export type NewKey = Insertable<KeyTable>;
export type UpdateKey = Updateable<KeyTable>;

export type Page = Selectable<PageTable>;
export type NewPage = Insertable<PageTable>;
export type UpdatePage = Updateable<PageTable>;

export type File = Selectable<FileTable>;
export type NewFile = Insertable<FileTable>;
export type UpdateFile = Updateable<FileTable>;

export type Setting = Selectable<SettingTable>;
export type NewSetting = Insertable<SettingTable>;
export type UpdateSetting = Updateable<SettingTable>;

export type GlobalVariable = Selectable<GlobalVariableTable>;
export type NewGlobalVariable = Insertable<GlobalVariableTable>;
export type UpdateGlobalVariable = Updateable<GlobalVariableTable>;
