import { Button } from "#src/components/ui/button.tsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "#src/components/ui/context-menu.tsx";
import { DeletePageDialog } from "#src/core/components/DeletePageDialog.tsx";
import { RenamePageDialog } from "#src/core/components/RenamePageDialog.tsx";
import { updatePageMutationOptions } from "#src/core/queries/edit-page-mutation.ts";
import type { Page } from "#src/lib/api.ts";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  PencilLine,
  Pin,
  PinOff,
  SquareArrowUpRightEnter,
  Trash,
  TrashOff,
} from "lucide-react";
import { useState } from "react";

interface PageListItemProps {
  page: Page;
}

export function PageListItem(props: PageListItemProps) {
  const { page } = props;

  const updatePageMutation = useMutation(
    updatePageMutationOptions(page.organizationId, page.id),
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <Button
              variant={"ghost"}
              size={"lg"}
              nativeButton={false}
              render={
                <Link
                  to="/s/$spaceId/p/$pageId"
                  params={{
                    spaceId: page.organizationId,
                    pageId: page.id,
                  }}
                  search={(prev) => prev}
                  preload={false}
                  activeProps={{ className: "bg-muted" }}
                />
              }
            />
          }
          className={" w-full justify-start"}
        >
          {page.name}
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            render={
              <Link
                to="/s/$spaceId/p/$pageId"
                target="_blank"
                params={{
                  spaceId: page.organizationId,
                  pageId: page.id,
                }}
                search={(prev) => prev}
                preload={false}
              />
            }
          >
            <SquareArrowUpRightEnter />
            Open in new tab
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() =>
              updatePageMutation.mutate({ isPinned: !page.isPinned })
            }
          >
            {page.isPinned ? <PinOff /> : <Pin />}
            {page.isPinned ? "Unpin Page" : "Pin Page"}
          </ContextMenuItem>

          <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            <PencilLine />
            Rename
          </ContextMenuItem>

          {!page.deletedAt && (
            <ContextMenuItem
              variant="destructive"
              onClick={() => updatePageMutation.mutate({ isDeleted: true })}
            >
              <Trash />
              Move to Trash
            </ContextMenuItem>
          )}

          {page.deletedAt && (
            <>
              <ContextMenuItem
                onClick={() => updatePageMutation.mutate({ isDeleted: false })}
              >
                <TrashOff />
                Restore Page
              </ContextMenuItem>

              <ContextMenuItem
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash />
                Delete Permanently
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <DeletePageDialog
        page={page}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <RenamePageDialog
        page={page}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </>
  );
}
