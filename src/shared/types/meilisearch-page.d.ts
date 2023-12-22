type MeilisearchPage = {
  id: string;
  userId?: string;
  pageName?: string;
  textContent?: {
    posStart: number;
    posEnd: number;
    text: string;
  }[];
  createdAt?: number;
  modifiedAt?: number;
  isStarred?: boolean;
  isDeleted?: boolean;
};

export default MeilisearchPage;
