import { Button } from "@/components/ui/button";
import {
  useCreatePageMutation,
  useRecentPagesQuery,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const recentPageList = useRecentPagesQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  return (
    <div className="flex h-full w-full flex-col items-center gap-3 pt-[30vh]">
      <h1 className="mb-4 text-xl font-semibold">Page Not Found!</h1>

      <Button
        variant={"outline"}
        onClick={() =>
          createPageMutation.mutate({ pageName: "Untitled", parentId: null })
        }
        className="w-40"
      >
        Add New Page
      </Button>

      <Button
        variant={"outline"}
        onClick={() =>
          recentPageList.data && navigate(`/${recentPageList.data[0].id}`)
        }
        className="w-40"
      >
        Last Opened Page
      </Button>

      {/* <Button variant={"outline"} className="w-40">
        Show Recents
      </Button> */}
    </div>
  );
}
