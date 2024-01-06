import { googleAuth } from "@/configs/lucia.js";

export const validateGoogleOAuthCallback = async (code: string) => {
  const { getExistingUser, googleUser, createUser } =
    await googleAuth.validateCallback(code);

  const existingUser = await getExistingUser();

  if (existingUser) {
    return existingUser;
  } else {
    return await createUser({
      attributes: {
        name: googleUser.name,
        username: googleUser.name.toLowerCase(),
        image: googleUser.picture,
        email: googleUser.email,
        email_verified: googleUser.email_verified,
      },
    });
  }
};
