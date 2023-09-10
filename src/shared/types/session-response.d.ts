export default interface SessionResponse {
  editorKey: string;
  searchKey: string;
  user: {
    userId: string;
    name: string;
    image?: string;
    email?: string;
    emailVerified?: boolean;
  };
}
