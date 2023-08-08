import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Plus } from "lucide-react";

import { useCreatePageMutation } from "@/hooks/pageQueryHooks";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import DeletedPages from "./DeletedPages";
import PageTree from "@/components/tree-views/PageTree";
import FavouritePageTree from "../tree-views/FavouritePageTree";
import clsx from "clsx";

export default function PageList() {
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [favouritesDiv] = useAutoAnimate();
  const [mainTreeDiv] = useAutoAnimate();

  const createPageMutation = useCreatePageMutation(queryClient);

  return (
    <ScrollArea
      type="auto"
      className={clsx("flex h-[calc(100vh-3rem)] px-1 text-sm")}
    >
      {/* Favourites List - hides automatically when there are no favourited pages*/}
      <div ref={favouritesDiv} className="mb-2 px-2">
        <button
          onClick={() => setIsFavouritesOpen((prev) => !prev)}
          className="my-1 rounded p-1 text-xs font-semibold hover:bg-accent"
        >
          Favourites
        </button>
        {isFavouritesOpen && <FavouritePageTree />}
      </div>

      <div ref={mainTreeDiv} className="mb-2 px-2">
        <div className="my-1 rounded p-1 text-xs font-semibold">Pages</div>
        <PageTree />
      </div>

      <div className="mb-2 px-2">
        {/* Add Page Button */}
        {/* <Button
        variant={"ghost"}
        size={"default"}
        onClick={() => createPageMutation.mutate()}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="flex-grow text-start">Add Page</span>
      </Button> */}

        <DeletedPages />
      </div>
    </ScrollArea>
  );
}
