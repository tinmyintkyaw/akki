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
  const [pageIdToChange, setIdPageToChange] = useState<string>("");

  const router = useRouter();
  const queryClient = useQueryClient();
  const recentPagesQuery = useRecentPagesQuery();
  const deletedPagesQuery = useDeletedPagesQuery();
  const undoDeletePageMutation = useUndoDeletePageMutation(
    pageIdToChange,
    queryClient
  );
  const permanentlyDeletePageMutation = usePermanentlyDeletePageMutation(
    pageIdToChange,
    queryClient
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Trash</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-screen w-screen flex-col md:h-[50vh]">
        <DialogHeader className="w-full">
          <DialogTitle>Trash</DialogTitle>
        </DialogHeader>

        <ScrollArea>
          {deletedPagesQuery.data &&
            deletedPagesQuery.data.map((page: any) => (
              <Button
                variant={"ghost"}
                size={"default"}
                key={page.id}
                onClick={() => {
                  router.push(`/${page.id}`);
                  setIsOpen(false);
                }}
                className="w-full"
                asChild
              >
                <div>
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="flex-grow text-start">{page.pageName}</span>

                  {/* Buttons nested inside another button  */}
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={(e) => {
                      setIdPageToChange(page.id);
                      undoDeletePageMutation.mutate();
                      setIsOpen(false);
                    }}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>

                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={async (e) => {
                      setIdPageToChange(page.id);
                      permanentlyDeletePageMutation.mutate();

                      await recentPagesQuery.refetch();
                      if (!recentPagesQuery.data[0]) router.push("/new");
                      router.push(`/${recentPagesQuery.data[0].id}`);

                      setIsOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Button>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedPages;
