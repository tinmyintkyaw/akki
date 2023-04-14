import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import {
  getProviders,
  getCsrfToken,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { useEffect } from "react";
import { BsDiscord } from "react-icons/bs";

import { authOptions } from "./api/auth/[...nextauth]";
import { inter } from "./_app";

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  crsfToken: string | undefined;
};

export default function SignIn(props: SignInProps) {
  useEffect(() => console.log(props.providers), []);

  return (
    <main
      className={`${inter.className} flex h-screen w-full items-center justify-center bg-zinc-100`}
    >
      <div className="flex flex-col items-center">
        <h1 className="my-4 text-2xl font-semibold">Sign In</h1>
        {props.providers &&
          Object.values(props.providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className={`inline-flex h-10 w-80 items-center justify-center rounded border border-zinc-300 bg-zinc-100 text-sm font-medium text-zinc-900 hover:bg-zinc-200`}
            >
              {provider.id === "discord" && (
                <BsDiscord className="mr-2 h-4 w-4" />
              )}
              {`Continue with ${provider.name}`}
            </button>
          ))}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) return { redirect: { destination: "/page", permanent: false } };

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
