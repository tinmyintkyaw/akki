import Joi from "joi";

export const pageIdAsParamsSchema = Joi.object({
  pageId: Joi.string().trim().min(1).required(),
});

export const editPagePayloadSchema = Joi.object({
  pageName: Joi.string().trim().min(1),
  parentId: Joi.string().allow(null).trim(),
  isStarred: Joi.boolean(),
  isDeleted: Joi.boolean(),
  accessedAt: Joi.string().isoDate(),
}).or("pageName", "parentId", "isStarred", "isDeleted", "accessedAt");

export const createPagePayloadSchema = Joi.object({
  pageName: Joi.string().trim().required(),
  parentId: Joi.string().allow(null).trim().required(),
});
