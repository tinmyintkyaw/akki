import Toolbar from "@/components/toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreatePageMutation,
  useRecentPagesQuery,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const recentPageListQuery = useRecentPagesQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  useEffect(() => {
    if (recentPageListQuery.isError || recentPageListQuery.isLoading) return;
    navigate(`/${recentPageListQuery.data[0].id}`);
  }, [
    navigate,
    recentPageListQuery.data,
    recentPageListQuery.isError,
    recentPageListQuery.isLoading,
  ]);

  return (
    <>
      {!recentPageListQuery.isLoading &&
        !recentPageListQuery.isError &&
        recentPageListQuery.data.length === 0 && (
          <>
            <Toolbar title="No Pages Found!" />

            <div className="flex h-full w-full flex-col items-center gap-3 pt-[30%]">
              <h1 className="mb-4 text-xl font-semibold">No Pages Found!</h1>

              <Button
                variant={"outline"}
                onClick={() =>
                  createPageMutation.mutate({
                    pageName: "Untitled",
                    parentId: null,
                  })
                }
              >
                Add New Page
              </Button>
            </div>
          </>
        )}
    </>
  );
}
