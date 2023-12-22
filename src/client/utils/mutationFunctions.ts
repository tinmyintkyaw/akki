import { PageResponse } from "@/shared/types/queryResponse";

export class HTTPError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const createPage = async (variables: {
  pageName: string;
  parentId?: string | null;
}) => {
  const { pageName, parentId } = variables;

  const response = await fetch("/api/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageName, parentId }),
  });
  if (!response.ok)
    throw new HTTPError("Failed to create page", response.status);
  const json: PageResponse = await response.json();
  return json;
};

export const updatePage = async (variables: {
  id: string;
  pageName?: string;
  parentId?: string | null;
  isStarred?: boolean;
  accessedAt?: string;
}) => {
  const { id, pageName, parentId, isStarred, accessedAt } = variables;

  const response = await fetch(`/api/pages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageName,
      parentId,
      isStarred,
      accessedAt,
    }),
  });
  if (!response.ok)
    throw new HTTPError("Failed to update page", response.status);
  const json: PageResponse = await response.json();
  return json;
};

export const deletePage = async (variables: { id: string }) => {
  const { id } = variables;

  const response = await fetch(`/api/pages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isDeleted: true,
    }),
  });
  if (!response.ok)
    throw new HTTPError("Failed to delete page", response.status);
  const json: PageResponse = await response.json();
  return json;
};

export const permanentlyDeletePage = async (variables: { id: string }) => {
  const { id } = variables;

  const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
  if (!response.ok)
    throw new HTTPError("Failed to delete page", response.status);
  return response;
};

export const undoDeletePage = async (variables: { id: string }) => {
  const { id } = variables;

  const response = await fetch(`/api/pages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isDeleted: false }),
  });
  if (!response.ok)
    throw new HTTPError("Failed to revert delete page", response.status);
  const json: PageResponse = await response.json();
  return json;
};
