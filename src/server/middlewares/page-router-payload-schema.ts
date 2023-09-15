import { AllowedSchema } from "express-json-validator-middleware";

export const editPagePayloadSchema: AllowedSchema = {
  type: "object",
  properties: {
    pageName: { type: "string" },
    parentId: { type: "string", nullable: true },
    isStarred: { type: "boolean" },
    isDeleted: { type: "boolean" },
    accessedAt: { type: "string", format: "date-time" },
  },
  anyOf: [
    { required: ["pageName"] },
    { required: ["parentId"] },
    { required: ["isStarred"] },
    { required: ["isDeleted"] },
    { required: ["accessedAt"] },
  ],
};

export const createPagePayloadSchema: AllowedSchema = {
  type: "object",
  properties: {
    pageName: { type: "string" },
    parentId: { type: "string", nullable: true },
  },
  required: ["pageName", "parentId"],
};
