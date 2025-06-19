import EmptyPageList from "@/components/error/EmptyPageList";
import queryClient from "@/queryClient";
import { getRecentPageList } from "@/utils/queryFunctions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/page/")({
  beforeLoad: async () => {
    const recentPageList = await queryClient.fetchQuery({
      queryKey: ["recentPages"],
      queryFn: getRecentPageList,
    });

    if (recentPageList.length > 0)
      throw redirect({
        to: `/page/$pageId`,
        params: { pageId: recentPageList[0].id },
      });

    throw new Error();
  },
  errorComponent: () => <EmptyPageList />,
});
