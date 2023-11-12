import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const typesenseCollectionSchema: CollectionCreateSchema = {
  name: "pages",
  fields: [
    {
      name: "pageName",
      type: "string",
      facet: true,
    },
    {
      name: "textContent",
      type: "string",
      facet: false,
    },
    {
      name: "createdAt",
      type: "int64",
      facet: true,
    },
    {
      name: "modifiedAt",
      type: "int64",
      facet: true,
    },
    {
      name: "isStarred",
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
