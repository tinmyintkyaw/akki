import { auth } from "@/configs/lucia.js";

/**
 * Generates a new session object
 * @param userId
 */
const createSession = async (userId: string) => {
  return await auth.createSession({ userId: userId, attributes: {} });
};

export { createSession };
