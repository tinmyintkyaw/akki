export type MeilisearchTextContent = Array<{
  posStart: number;
  posEnd: number;
  text: string;
}>;

export type MeilisearchPage = {
  id: string;
  userId?: string;
  pageName?: string;
  textContent?: MeilisearchTextContent;
  isStarred?: boolean;
  createdAt?: number;
  modifiedAt?: number;
  deletedAt?: number | null;
};
