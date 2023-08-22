import Head from "next/head";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import {
  getProviders,
  getCsrfToken,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { authOptions } from "./api/auth/[...nextauth]";

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  crsfToken: string | undefined;
};

export default function SignIn(props: SignInProps) {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-background">
      <Head>
        <title>Sign In</title>
      </Head>

      <div className="flex select-none flex-col items-center gap-2">
        <h1 className="mb-4 text-2xl font-semibold">Sign In</h1>
        {props.providers &&
          Object.values(props.providers).map((provider) => (
            <Button
              variant={"outline"}
              size={"default"}
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="w-64"
            >
              {provider.id === "google" && (
                <BsGoogle className="mr-3 h-4 w-4" />
              )}

              {provider.id === "github" && (
                <BsGithub className="mr-3 h-4 w-4" />
              )}

              {provider.id === "discord" && (
                <BsDiscord className="mr-3 h-4 w-4" />
              )}

              <span>{`Continue with ${provider.name}`}</span>
            </Button>
          ))}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) return { redirect: { destination: "/", permanent: false } };

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  if (!providers) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      providers: providers,
      crsfToken: csrfToken,
    },
  };
};
