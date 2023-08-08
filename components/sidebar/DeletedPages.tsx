import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FileText, Trash2, Undo } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  useRecentPagesQuery,
  useDeletedPagesQuery,
  usePermanentlyDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";

const DeletedPages: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const recentPagesQuery = useRecentPagesQuery();
  const deletedPagesQuery = useDeletedPagesQuery();
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);
  const permanentlyDeletePageMutation =
    usePermanentlyDeletePageMutation(queryClient);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Trash</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-screen w-screen flex-col md:h-[50vh] xl:max-w-lg">
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
                  router.push(`/${page.id}`);
                  setIsOpen(false);
                }}
                className="h-full w-full py-2"
              >
                <div className="flex flex-grow flex-col">
                  <div className="inline-flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="flex-grow select-none text-start">
                      {page.pageName}
                    </span>
                  </div>
                  <span className="flex-grow select-none pl-6 text-start text-xs text-muted-foreground">
                    {page.collectionName}
                  </span>
                </div>

                {/* Buttons nested inside another button  */}
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    undoDeletePageMutation.mutate({ id: page.id });
                    setIsOpen(false);
                  }}
                  className="hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <Undo className="h-4 w-4" />
                </Button>

                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={async () => {
                    permanentlyDeletePageMutation.mutate({ id: page.id });

                    if (page.id !== router.query.pageId)
                      return setIsOpen(false);

                    await recentPagesQuery.refetch();
                    if (
                      recentPagesQuery.isError ||
                      !recentPagesQuery.data ||
                      !recentPagesQuery.data[0]
                    )
                      return router.push("/new");

                    router.push(`/${recentPagesQuery.data[0].id}`);
                    setIsOpen(false);
                  }}
                  className="hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Button>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedPages;
