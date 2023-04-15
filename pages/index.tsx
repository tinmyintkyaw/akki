import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useRecentPagesQuery } from "@/hooks/queryHooks";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const recentPages = useRecentPagesQuery();

  if (session.status === "authenticated") {
    if (!recentPages.isLoading && !recentPages.isError && recentPages.data) {
      if (!recentPages.data[0]) router.push("/new");
      router.push(`/${recentPages.data[0].id}`);
    }
  }

  if (session.status === "unauthenticated") {
    // TODO: Landing page
    // return <p>Index</p>;
    router.push("/login");
  }
}
