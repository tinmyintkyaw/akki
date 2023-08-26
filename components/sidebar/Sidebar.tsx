import clsx from "clsx";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { PanelLeftClose, Plus, SquareAsterisk } from "lucide-react";

import DeletedPages from "@/components/sidebar/DeletedPages";
import PageTree from "@/components/tree-views/PageTree";
import FavouritePageTree from "@/components/tree-views/FavouritePageTree";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useCreatePageMutation } from "@/hooks/pageQueryHooks";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsOpen }) => {
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(true);

  const queryClient = useQueryClient();
  const [favouritesDiv] = useAutoAnimate();
  const [mainTreeDiv] = useAutoAnimate();

  const createPageMutation = useCreatePageMutation(queryClient);

  return (
    <aside className="bg-muted">
      <div className="flex h-12 select-none flex-row items-center justify-between gap-2 px-3">
        <header className="ml-2 flex flex-row justify-start">
          <SquareAsterisk className="mr-2 h-6 w-6" />
          <h1>Project Potion</h1>
        </header>

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsOpen(false)}
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea
        type="hover"
        className={clsx("flex h-[calc(100vh-9rem)] text-sm")}
      >
        <div ref={favouritesDiv} className="px-3 pb-2 pt-1">
          <Button
            variant={"ghost"}
            size={"default"}
            onClick={() => setIsFavouritesOpen((prev) => !prev)}
            className="h-7"
          >
            <span className="w-full text-start text-[13px] font-medium text-muted-foreground">
              Starred
            </span>
          </Button>

          {isFavouritesOpen && <FavouritePageTree />}
        </div>

        <div ref={mainTreeDiv} className="px-3 pb-2 pt-1">
          <Button variant={"ghost"} size={"default"} className="h-7">
            <span className="w-full text-start text-[13px] font-medium text-muted-foreground">
              Pages
            </span>
          </Button>
          <PageTree />
        </div>
      </ScrollArea>

      <div className="border-t-2 border-border px-3 py-3">
        <Button
          variant={"ghost"}
          className="w-full justify-start"
          onClick={() =>
            createPageMutation.mutate({ pageName: "Untitled", parentId: null })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="align-middle leading-4">New Page</span>
        </Button>

        <DeletedPages />
      </div>
    </aside>
  );
};

export default Sidebar;
