type TypesenseDocument = {
  id: string;
  pageName: string;
  textContent?: string;
  createdAt: number;
  modifiedAt: number;
  isStarred: boolean;
  userId: string;
};

export default TypesenseDocument;
