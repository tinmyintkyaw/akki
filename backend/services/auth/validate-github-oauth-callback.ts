import { githubAuth } from "@/configs/lucia.js";

export const validateGithubOAuthCallback = async (code: string) => {
  const { getExistingUser, githubUser, createUser } =
    await githubAuth.validateCallback(code);

  const existingUser = await getExistingUser();

  if (existingUser) {
    return existingUser;
  } else {
    return await createUser({
      attributes: {
        name: githubUser.name ? githubUser.name : githubUser.login,
        username: githubUser.login,
        image: githubUser.avatar_url,
        email: githubUser.email ?? undefined,
        email_verified: false,
      },
    });
  }
};
