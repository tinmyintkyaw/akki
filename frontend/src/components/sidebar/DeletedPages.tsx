import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useDeletedPagesQuery,
  usePermanentlyDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Undo } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeletedPages: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deletedPagesQuery = useDeletedPagesQuery();
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);
  const permanentlyDeletePageMutation =
    usePermanentlyDeletePageMutation(queryClient);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="align-middle leading-4">Trash</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-screen w-screen flex-col bg-popover md:h-[60vh] md:max-w-xl">
        <DialogHeader className="w-full">
          <DialogTitle>Trash</DialogTitle>
        </DialogHeader>

        <ScrollArea className="pr-3">
          {deletedPagesQuery.data &&
            deletedPagesQuery.data.map((page) => (
              <Button
                variant={"ghost"}
                size={"default"}
                key={page.id}
                onClick={() => {
                  navigate(`/${page.id}`);
                  setIsOpen(false);
                }}
                className="h-full w-full py-2"
              >
                <div className="flex flex-grow flex-col pl-2">
                  <div className="inline-flex items-center">
                    {/* <FileText className="mr-2 h-4 w-4" /> */}
                    <span className="flex-grow select-none text-start">
                      {page.pageName}
                    </span>
                  </div>
                  <span className="flex-grow select-none text-start text-xs text-muted-foreground">
                    {page.path.split(".")[-1]}
                  </span>
                </div>

                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    undoDeletePageMutation.mutate({ id: page.id });
                    setIsOpen(false);
                  }}
                  className="hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Undo className="h-4 w-4" />
                </Button>

                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={async () => {
                    permanentlyDeletePageMutation.mutate(
                      { id: page.id },
                      { onSuccess: () => navigate("/") },
                    );
                  }}
                  className="hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Button>
            ))}

          {deletedPagesQuery.data && deletedPagesQuery.data.length === 0 && (
            <p className="mt-6 w-full text-center text-sm">No Pages in Trash</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedPages;
