import AppHome from "@/components/Main";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App() {
  const { status } = useSession();
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);

  useEffect(() => {
    if (status !== "unauthenticated") return;
    router.push("/signin");
  }, [router, status]);

  return <AppHome />;
}
