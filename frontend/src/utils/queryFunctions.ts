import { PageListResponse, PageResponse } from "@project/shared-types";

export class HTTPError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchError";
    this.status = status;
  }
}

export const getPageList = async () => {
  const response = await fetch("/api/pages");
  if (!response.ok)
    throw new HTTPError("Failed to fetch pages", response.status);

  const json: PageListResponse = await response.json();
  return json;
};

export const getRecentPageList = async () => {
  const response = await fetch("/api/pages/recent");
  if (!response.ok)
    throw new HTTPError("Failed to fetch recent pages", response.status);
  const json: PageListResponse = await response.json();
  return json;
};

export const getDeletedPageList = async () => {
  const response = await fetch("/api/pages/deleted");
  if (!response.ok)
    throw new HTTPError("Failed to fetch deleted pages", response.status);
  const json: PageListResponse = await response.json();
  return json;
};

export const getStarredPageList = async () => {
  const response = await fetch("/api/pages/starred");
  if (!response.ok)
    throw new HTTPError("Failed to fetch starred pages", response.status);
  const json: PageListResponse = await response.json();
  return json;
};

export const getPageById = async (pageId: string) => {
  const response = await fetch(`/api/pages/${pageId}`);
  if (!response.ok)
    throw new HTTPError("Failed to fetch page", response.status);
  const json: PageResponse = await response.json();
  return json;
};
