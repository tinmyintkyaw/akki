import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections.js";

const typesenseCollectionSchema: CollectionCreateSchema = {
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
export default typesenseCollectionSchema;
