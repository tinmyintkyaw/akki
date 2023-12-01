import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import MeilisearchPage from "@/shared/types/meilisearch-page";
import { ArrowDownUp, CornerDownLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Configure,
  Highlight,
  Snippet,
  useHits,
  useSearchBox,
} from "react-instantsearch";
import { useNavigate } from "react-router-dom";

type SearchComboBoxProps = {
  children: ReactNode;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const navigate = useNavigate();
  const { refine } = useSearchBox();
  const { hits } = useHits<MeilisearchPage>();

  const [isOpen, setIsOpen] = useState(false);
  const [searchFilters] = useState("isDeleted=false");

  // Open with keyboard shortcut
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Configure
        attributesToHighlight={["pageName", "textContent"]}
        attributesToSnippet={["textContent:20"]}
        attributesToRetrieve={["id", "pageName"]}
        filters={searchFilters}
      />

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          refine("");
          setIsOpen((prev) => !prev);
        }}
      >
        <DialogTrigger asChild>{props.children}</DialogTrigger>

        <DialogContent className="p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              onValueChange={(value) => refine(value)}
              className="h-12"
            />
            <CommandList className="max-h-[calc(100vh-80px)] overflow-hidden md:max-h-[50vh]">
              {hits.length === 0 && (
                <CommandEmpty>No Results Found</CommandEmpty>
              )}

              <ScrollArea className="h-[calc(100vh-80px)] w-full md:h-[50vh]">
                {hits.map((hit) => (
                  <CommandItem
                    key={hit.objectID}
                    value={hit.objectID}
                    className="flex w-full flex-col gap-1 rounded-none px-4 py-3"
                    onSelect={(value) => {
                      navigate(`/${value}`);
                      setIsOpen((prev) => !prev);
                    }}
                  >
                    <div className="w-full text-[15px] font-medium">
                      <Highlight
                        attribute={"pageName"}
                        hit={hit}
                        className="line-clamp-2"
                        highlightedTagName={"strong"}
                        classNames={{
                          highlighted: "text-gray-950 dark:text-gray-100",
                          nonHighlighted: "text-gray-800 dark:text-gray-200",
                        }}
                      />
                    </div>

                    <div className="w-full text-sm font-medium">
                      <Snippet
                        attribute={"textContent"}
                        hit={hit}
                        highlightedTagName={"strong"}
                        className="line-clamp-2"
                        classNames={{
                          highlighted: "text-gray-950 dark:text-gray-100",
                          nonHighlighted: "text-gray-800 dark:text-gray-400",
                        }}
                      />
                    </div>
                  </CommandItem>
                ))}
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
    </>
  );
}
