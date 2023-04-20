import prisma from "@/lib/prismadb";
import Typesense from "typesense";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { Document } from "typesense/lib/Typesense/Document";

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT
  ? parseInt(process.env.TYPESENSE_PORT)
  : 8108;

if (!process.env.TYPESENSE_API_KEY) {
  throw new Error("Missing TYPESENSE_API_KEY");
}

const serverTypesenseClient = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: TYPESENSE_PORT,
      protocol: "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
});

export interface typesensePageDocument {
  id: string;
  pageName: string;
  pageTextContent: string;
  pageCreatedAt: number;
  pageModifiedAt: number;
  isFavourite: boolean;
  userId: string;
}

export const typesenseCollectionSchema: CollectionCreateSchema = {
  name: "pages",
  fields: [
    {
      name: "pageName",
      type: "string",
      facet: true,
    },
    {
      name: "pageTextContent",
      type: "string",
      facet: false,
    },
    {
      name: "pageCreatedAt",
      type: "int64",
      facet: true,
    },
    {
      name: "pageModifiedAt",
      type: "int64",
      facet: true,
    },
    {
      name: "isFavourite",
      type: "bool",
      facet: true,
    },
    {
      name: "userId",
      type: "string",
      facet: true,
    },
  ],
};

export default serverTypesenseClient;
