import { checkSchema } from "express-validator";

export const validateCreatePageBody = checkSchema(
  {
    pageName: {
      isString: true,
      trim: true,
      escape: true,
      notEmpty: true,
    },

    parentId: {
      custom: {
        options: (value) => value === null || typeof value === "string",
      },
      exists: {
        if: (value) => value !== null,
      },
      isString: true,
      trim: true,
      escape: true,
      notEmpty: true,
    },
  },
  ["body"]
);

export const validateEditPageBody = checkSchema(
  {
    pageName: {
      isString: true,
      trim: true,
      escape: true,
      notEmpty: true,
    },

    parentId: {
      custom: {
        options: (value) => value === null || typeof value === "string",
      },
      exists: {
        if: (value) => value !== null,
      },
      isString: true,
      trim: true,
      escape: true,
      notEmpty: true,
    },

    isStarred: {
      isBoolean: true,
    },

    isDeleted: {
      isBoolean: true,
    },

    accessedAt: {
      isISO8601: true,
    },
  },
  ["body"]
);
