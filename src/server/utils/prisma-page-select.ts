import { Prisma } from "@prisma/client";

export const pageSelect = {
  id: true,
  pageName: true,
  isStarred: true,
  createdAt: true,
  accessedAt: true,
  modifiedAt: true,
  userId: true,
  isDeleted: true,
  deletedAt: true,
  parentId: true,
  childPages: {
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      pageName: true,
      userId: true,
      isStarred: true,
      createdAt: true,
      modifiedAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  files: {
    select: {
      id: true,
      fileName: true,
    },
  },
  Page: {
    select: {
      pageName: true,
    },
  },
} satisfies Prisma.PageSelect;
