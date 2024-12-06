export type PageResponse = {
  id: string;
  userId: string;
  pageName: string;
  path: string;
  isStarred: boolean;
  createdAt: Date;
  modifiedAt: Date;
  accessedAt: Date;
  deletedAt: Date | null;
};

export type PageListResponse = Array<PageResponse & { children?: string[] }>;
