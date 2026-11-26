import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import { DeletePageDialog } from "#src/core/components/DeletePageDialog.tsx";
import { updatePageMutationOptions } from "#src/core/queries/edit-page-mutation.ts";
import type { Page } from "#src/lib/api.ts";
import { useMutation } from "@tanstack/react-query";
import {
  EllipsisVertical,
  Pin,
  PinOff,
  Trash,
  TrashOff,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#src/components/ui/button.tsx";

type EditorMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
};

type EditorMenuContext = {
  isPinned: boolean;
  isDeleted: boolean;
  onTogglePinned: EditorMenuItem["onClick"];
  onMoveToTrash: EditorMenuItem["onClick"];
  onRestore: EditorMenuItem["onClick"];
  onDeletePermanently: EditorMenuItem["onClick"];
};

function getEditorMenuItems(context: EditorMenuContext): EditorMenuItem[] {
  return [
    {
      id: "toggle-pinned",
      label: context.isPinned ? "Unpin Page" : "Remove from Pinned",
      icon: context.isPinned ? PinOff : Pin,
      disabled: !!context.isDeleted,
      onClick: context.onTogglePinned,
    },

    ...(context.isDeleted
      ? [
          {
            id: "restore",
            label: "Restore Page",
            icon: TrashOff,
            onClick: context.onRestore,
          },
          {
            id: "delete",
            label: "Delete Permanently",
            icon: Trash,
            destructive: true,
            onClick: context.onDeletePermanently,
          },
        ]
      : [
          {
            id: "trash",
            label: "Move to Trash",
            icon: Trash,
            onClick: context.onMoveToTrash,
          },
        ]),
  ];
}

interface EditorHeaderMenuProps {
  page: Page;
}

export function EditorHeaderMenu(props: EditorHeaderMenuProps) {
  const { page } = props;

  const [delDialogOpen, setDelDialogOpen] = useState(false);

  const updatePageMutation = useMutation(
    updatePageMutationOptions(page.organizationId, page.id),
  );

  const menuItems = getEditorMenuItems({
    isPinned: page.isPinned,
    isDeleted: !!page.deletedAt,
    onTogglePinned: () => {
      updatePageMutation.mutate({ isPinned: !page.isPinned });
    },
    onMoveToTrash: () => updatePageMutation.mutate({ isDeleted: true }),
    onRestore: () => updatePageMutation.mutate({ isDeleted: false }),
    onDeletePermanently: () => setDelDialogOpen(true),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-lg" className="ml-auto" />}
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>

        <DropdownMenuContent className={"w-56"}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                disabled={item.disabled}
                variant={item.destructive ? "destructive" : "default"}
                onClick={item.onClick}
              >
                {<item.icon />}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {page && (
        <DeletePageDialog
          open={delDialogOpen}
          onOpenChange={setDelDialogOpen}
          page={page}
        />
      )}
    </>
  );
}
