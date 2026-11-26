import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#src/components/ui/alert-dialog.tsx";
import { deletePageMutationOptions } from "#src/core/queries/delete-page-mutation.ts";
import type { Page } from "#src/lib/api.ts";
import { useMutation } from "@tanstack/react-query";

interface DeletePageDialogProps {
  page: Page;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePageDialog(props: DeletePageDialogProps) {
  const { page, open, onOpenChange } = props;

  const deletePageMutation = useMutation(
    deletePageMutationOptions(page.organizationId, page.id),
  );

  const deletePageHandler = async () => {
    await deletePageMutation.mutateAsync();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete page permanently</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete the page. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant={"destructive"}
            onClick={deletePageHandler}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
