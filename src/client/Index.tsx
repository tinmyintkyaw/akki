import Toolbar from "@/components/toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreatePageMutation,
  useRecentPagesQuery,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

export default function Index() {
  const queryClient = useQueryClient();
  const recentPageListQuery = useRecentPagesQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  return (
    <>
      {!recentPageListQuery.isLoading && !recentPageListQuery.isError && (
        <>
          {recentPageListQuery.data.length > 0 ? (
            <Navigate to={`/${recentPageListQuery.data[0].id}`} />
          ) : (
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
      )}
    </>
  );
}
