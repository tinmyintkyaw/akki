import { Button } from "@/components/ui/button";
import React from "react";
import {
  usePageQuery,
  usePermanentlyDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const DeletedPageBanner: React.FC<{ pageId: string }> = (props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);
  const permanentlyDeletePageMutation =
    usePermanentlyDeletePageMutation(queryClient);

  return (
    <div className="flex h-12 w-full items-center justify-center gap-4 bg-red-100 py-2 text-sm dark:bg-red-900">
      <p className="select-none font-medium">This page is currently in Trash</p>
      <Button
        variant={"outline"}
        onClick={() =>
          undoDeletePageMutation.mutate({
            id: props.pageId,
          })
        }
        className="h-8 border-red-300 bg-transparent hover:bg-red-200 dark:border-red-400 dark:hover:bg-red-800 truncate"
      >
        Restore
      </Button>

      <Button
        variant={"outline"}
        onClick={async () => {
          permanentlyDeletePageMutation.mutate({
            id: props.pageId,
          });
          router.push("/");
        }}
        className="h-8 border-red-300 bg-transparent hover:bg-red-200 dark:border-red-400 dark:hover:bg-red-800 truncate"
      >
        Delete Permanently
      </Button>
    </div>
  );
};
export default DeletedPageBanner;
