import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useRecentPagesQuery } from "@/hooks/queryHooks";

export default function Home() {
  const router = useRouter();
  const recentPages = useRecentPagesQuery();

  if (!recentPages.isLoading && !recentPages.isError && recentPages.data) {
    router.push(`/page/${recentPages.data[0].id}`);
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session)
    return { redirect: { destination: "/api/auth/signin", permanent: false } };

  return {
    props: {
      session: session,
    },
  };
};
