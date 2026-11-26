import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#src/components/ui/alert-dialog.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { updatePageMutationOptions } from "#src/core/queries/edit-page-mutation.ts";
import type { Page } from "#src/lib/api.ts";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface RenamePageDialogProps {
  page: Page;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenamePageDialog(props: RenamePageDialogProps) {
  const { page, open, onOpenChange } = props;

  const [newName, setNewName] = useState(page.name);

  const updatePageMutation = useMutation(
    updatePageMutationOptions(page.organizationId, page.id),
  );

  const renameHandler = async () => {
    await updatePageMutation.mutateAsync({ name: newName });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rename Page</AlertDialogTitle>
        </AlertDialogHeader>

        <Input
          minLength={1}
          maxLength={512}
          placeholder={page.name}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={renameHandler}>Rename</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
