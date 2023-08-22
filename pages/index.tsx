import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session)
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };

  try {
    const recentPages = await prisma.page.findMany({
      where: {
        userId: session.accountId,
        isDeleted: false,
      },
      orderBy: {
        accessedAt: "desc",
      },
      take: 3,
      select: {
        id: true,
      },
    });

    if (recentPages.length > 0) {
      return {
        redirect: {
          destination: `/${recentPages[0].id}`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/new",
          permanent: false,
        },
      };
    }
  } catch (err) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
};

export default function Home(): InferGetServerSidePropsType<
  typeof getServerSideProps
> {
  // Marketing Page
  return <main></main>;
}
