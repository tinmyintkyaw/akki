export default interface SessionResponse {
  user: {
    userId: string;
    name: string;
    image?: string;
    email?: string;
    emailVerified?: boolean;
  };
}
