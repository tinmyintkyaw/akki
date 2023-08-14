import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LogOut, Settings, Star, StarOff, Trash2 } from "lucide-react";

import {
  usePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { signOut } from "next-auth/react";

type ToolbarDropdownProps = {
  children: React.ReactNode;
};

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const toggleFavouriteMutation = useUpdatePageMutation(queryClient);
  const deletePageMutation = useDeletePageMutation(queryClient);
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {pageQuery.data && (
          <>
            <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
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
                toast({
                  title: "Page Moved to Trash",
                  action: (
                    <ToastAction
                      onClick={() =>
                        undoDeletePageMutation.mutate({
                          id: router.query.pageId as string,
                        })
                      }
                      altText="Undo"
                    >
                      Undo
                    </ToastAction>
                  ),
                });
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Page</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Signout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
