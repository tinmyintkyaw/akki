import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Star, StarOff, Trash2 } from "lucide-react";

import {
  usePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";

import Toast from "./Toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ToolbarDropdownProps = {
  children: React.ReactNode;
};

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const [showUndoToast, setShowUndoToast] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const toggleFavouriteMutation = useUpdatePageMutation(queryClient);
  const deletePageMutation = useDeletePageMutation(queryClient);
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>

        {pageQuery.data && (
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Page Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                toggleFavouriteMutation.mutate({
                  id: router.query.pageId as string,
                  isFavourite: !pageQuery.data.isFavourite,
                })
              }
            >
              {pageQuery.data?.isFavourite ? (
                <StarOff className="mr-2 h-4 w-4" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}

              <span>
                {pageQuery.data?.isFavourite
                  ? "Remove from favourites"
                  : "Add to favourites"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                deletePageMutation.mutate({
                  id: router.query.pageId as string,
                });
                setShowUndoToast(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Page</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      {/* Undo Delete Page Toast */}
      <Toast
        hasAction
        open={showUndoToast}
        onOpenChange={setShowUndoToast}
        actionText="Undo"
        title="Page moved to trash"
        actionOnClick={() => {
          undoDeletePageMutation.mutate({ id: router.query.pageId as string });
          setShowUndoToast(false);
        }}
      />
    </>
  );
}
