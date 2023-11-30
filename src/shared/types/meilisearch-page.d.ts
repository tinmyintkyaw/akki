type MeilisearchPage = {
  id: string;
  userId?: string;
  pageName?: string;
  textContent?: string;
  createdAt?: number;
  modifiedAt?: number;
  isStarred?: boolean;
  isDeleted?: boolean;
};

export default MeilisearchPage;
