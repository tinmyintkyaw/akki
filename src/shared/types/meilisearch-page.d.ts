type MeilisearchPage = {
  id: string;
  userId?: string;
  pageName?: string;
  textContent?: {
    pos: number;
    text: string;
  }[];
  createdAt?: number;
  modifiedAt?: number;
  isStarred?: boolean;
  isDeleted?: boolean;
};

export default MeilisearchPage;
