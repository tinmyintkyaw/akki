export type PageResponse = {
  id: string;
  userId: string;
  pageName: string;
  parentId: string;
  parentPageName: string;
  isStarred: boolean;
  createdAt: Date;
  modifiedAt: Date;
  accessedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  childPages: string[];
  files: {
    id: string;
    fileName: string;
  }[];
};

export type PageListResponse = PageResponse[];
