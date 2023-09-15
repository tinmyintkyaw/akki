import { useRecentPagesQuery } from "@/hooks/pageQueryHooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const recentPageListQuery = useRecentPagesQuery();

  useEffect(() => {
    if (recentPageListQuery.isError || recentPageListQuery.isLoading) return;
    // if (recentPageListQuery.data.length <= 0) navigate("/404");

    navigate(`/${recentPageListQuery.data[0].id}`);
  }, [
    navigate,
    recentPageListQuery.data,
    recentPageListQuery.isError,
    recentPageListQuery.isLoading,
  ]);

  return <></>;
}
