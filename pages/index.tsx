import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecentPagesQuery } from "@/hooks/pageQueryHooks";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const recentPagesQuery = useRecentPagesQuery();

  useEffect(() => {
    if (recentPagesQuery.isLoading) return;
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/signin");

    if (!recentPagesQuery.isError) {
      if (recentPagesQuery.data.length > 0) {
        router.push(`/${recentPagesQuery.data[0].id}`);
      }
      router.push("/new");
    }
  }, [
    recentPagesQuery.data,
    recentPagesQuery.isError,
    recentPagesQuery.isLoading,
    router,
    status,
  ]);

  if (status === "loading") return <></>;
}
