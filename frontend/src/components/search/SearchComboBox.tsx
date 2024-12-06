import DefaultCommandItem from "@/components/search/DefaultCommandItem";
import NestedCommandItem from "@/components/search/NestedCommandItems";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useTransformHits from "@/hooks/useTransformHits";
import useStore from "@/zustand/store";
import { MeilisearchPage } from "@project/shared-types";
import { Hit } from "instantsearch.js";
import { ArrowDownUp, CornerDownLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Configure,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";

type SearchComboBoxProps = {
  children: ReactNode;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const isCmdPaletteOpen = useStore((state) => state.isCmdPaletteOpen);
  const setIsCmdPaletteOpen = useStore((state) => state.setIsCmdPaletteOpen);

  const { refine } = useSearchBox();
  const { hits } = useHits<MeilisearchPage>();
  const transformedHits = useTransformHits(hits);

  const [searchFilters] = useState("deletedAt=false");
  const [detailHit, setDetailHit] = useState<Hit<MeilisearchPage> | null>(null);

  // Open with keyboard shortcut
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsCmdPaletteOpen(!isCmdPaletteOpen);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCmdPaletteOpen, setIsCmdPaletteOpen]);

  useEffect(() => {
    const hit = transformedHits.find((hit) => hit.id === detailHit?.id);
    hit && setDetailHit(hit);
  }, [detailHit?.id, transformedHits]);

  const instantSearch = useInstantSearch();

  useEffect(() => console.log(instantSearch), [instantSearch]);

  return (
    <Dialog
      open={isCmdPaletteOpen}
      onOpenChange={(isOpen) => {
        refine("");
        setDetailHit(null);
        setIsCmdPaletteOpen(isOpen);
      }}
    >
      <Configure
        attributesToHighlight={["pageName", "textContent.text"]}
        attributesToSnippet={["textContent:10"]}
        attributesToRetrieve={["id", "pageName"]}
        filters={searchFilters}
      />
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          refine("");
          setDetailHit(null);
        }}
        className="p-0"
      >
        <Command
          shouldFilter={false}
          loop={true}
          onKeyDown={(e) => {
            if (e.key === "Escape" && detailHit) {
              e.preventDefault();
              setDetailHit(null);
            }
          }}
        >
          <CommandInput
            placeholder="Search..."
            onValueChange={(value) => refine(value)}
            className="h-12"
          />
          <CommandList className="max-h-[calc(100vh-80px)] overflow-hidden md:max-h-[50vh]">
            {transformedHits.length === 0 && (
              <CommandEmpty>No Results Found</CommandEmpty>
            )}

            <ScrollArea className="h-[calc(100vh-80px)] w-full md:h-[50vh]">
              {!detailHit &&
                transformedHits.map((hit, index) => (
                  <DefaultCommandItem
                    key={index}
                    hit={hit}
                    index={index}
                    transformedHits={transformedHits}
                    setDetailHit={setDetailHit}
                  />
                ))}

              {detailHit && (
                <NestedCommandItem
                  hit={detailHit}
                  transformedHits={transformedHits}
                  setDetailHit={setDetailHit}
                />
              )}
            </ScrollArea>
          </CommandList>

          {/* Keyboard Hints */}
          <div className="flex h-8 select-none items-center gap-4 border-t-2 px-3">
            <li className="flex h-full flex-row items-center gap-1">
              <ArrowDownUp className="h-3 w-3" />
              <p className="text-xs text-foreground">Select</p>
            </li>
            <li className="flex h-full flex-row items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              <p className="text-xs text-foreground">Open</p>
            </li>
            <li className="flex h-full flex-row items-center gap-1">
              <p className="text-xs font-medium">Esc</p>
              <p className="text-xs text-foreground">Dismiss</p>
            </li>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
