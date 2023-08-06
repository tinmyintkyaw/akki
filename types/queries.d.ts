import {
  Page as PrismaPage,
  Collection as PrismaCollection,
} from "@prisma/client";

export type Page = Omit<
  PrismaPage,
  "ydoc" | "textContent" | "isDeleted" | "deletedAt"
>;
export type DeletedPage = Omit<
  PrismaPage,
  "ydoc" | "textContent" | "isDeleted"
>;
export type PageList = Page[];
export type DeletedPageList = DeletedPage[];

export type Collection = Omit<PrismaCollection, "isDeleted" | "deletedAt"> & {
  pages: string[];
};
export type DeletedCollection = Omit<PrismaCollection, "isDeleted"> & {
  pages: string[];
};
export type CollectionList = Collection[];
export type DeletedCollectionList = DeletedCollection[];
