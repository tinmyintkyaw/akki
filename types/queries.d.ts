import {
  Page as PrismaPage,
  Collection as PrismaCollection,
} from "@prisma/client";

export type Page = Omit<PrismaPage, "ydoc" | "textContent"> & {
  collectionName: string;
};
export type PageList = Page[];

export type Collection = PrismaCollection & { pages: string[] };
export type CollectionList = Collection[];
