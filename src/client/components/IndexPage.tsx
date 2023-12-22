import EmptyPageList from "@/components/error/EmptyPageList";
import { useRecentPagesQuery } from "@/hooks/pageQueryHooks";
import { Navigate } from "react-router-dom";

export default function IndexPage() {
  const recentPageListQuery = useRecentPagesQuery();

  if (recentPageListQuery.isLoading) return <></>;

  if (!recentPageListQuery.isError && recentPageListQuery.data.length > 0) {
    return <Navigate to={`/${recentPageListQuery.data[0].id}`} />;
  } else {
    return <EmptyPageList />;
  }
}
