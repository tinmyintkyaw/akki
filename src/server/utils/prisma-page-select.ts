import { Prisma } from "@prisma/client";

export const pageSelect = {
  id: true,
  page_name: true,
  is_starred: true,
  created_at: true,
  accessed_at: true,
  modified_at: true,
  user_id: true,
  is_deleted: true,
  deleted_at: true,
  parent_id: true,
  child_pages: {
    where: {
      is_deleted: false,
    },
    select: {
      id: true,
      page_name: true,
      user_id: true,
      is_starred: true,
      created_at: true,
      modified_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
  },
  files: {
    select: {
      id: true,
      file_name: true,
    },
  },
  page: {
    select: {
      page_name: true,
    },
  },
} satisfies Prisma.PageSelect;
