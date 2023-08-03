import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Star, StarOff, Trash2 } from "lucide-react";

import {
  usePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/queryHooks";

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
  const toggleFavouriteMutation = useUpdatePageMutation(
    {
      id: pageQuery.data?.id as string,
      isFavourite: !pageQuery.data?.isFavourite as boolean,
    },
    queryClient
  );

  const deletePageMutation = useDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  const undoDeletePageMutation = useUndoDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Page Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => toggleFavouriteMutation.mutate()}>
            {pageQuery.data.isFavourite ? (
              <StarOff className="mr-2 h-4 w-4" />
            ) : (
              <Star className="mr-2 h-4 w-4" />
            )}

            <span>
              {pageQuery.data.isFavourite
                ? "Remove from favourites"
                : "Add to favourites"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              deletePageMutation.mutate();
              setShowUndoToast(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Page</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Undo Delete Page Toast */}
      <Toast
        hasAction
        open={showUndoToast}
        onOpenChange={setShowUndoToast}
        actionText="Undo"
        title="Page moved to trash"
        actionOnClick={() => {
          undoDeletePageMutation.mutate();
          setShowUndoToast(false);
        }}
      />
    </>
  );
}
