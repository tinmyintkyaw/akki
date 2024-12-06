import { Button } from "@/components/ui/button";
import { useCreatePageMutation } from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function EmptyPageList() {
  const queryClient = useQueryClient();
  const createPageMutation = useCreatePageMutation(queryClient);
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col items-center gap-3 pt-[35vh]">
      <h1 className="mb-4 text-xl font-semibold">No Pages Found!</h1>

      <Button
        variant={"outline"}
        onClick={() =>
          createPageMutation.mutate(
            {
              pageName: "Untitled",
              parentId: null,
            },
            {
              onSuccess(data) {
                navigate(data.id);
              },
            },
          )
        }
      >
        Add New Page
      </Button>
    </div>
  );
}
