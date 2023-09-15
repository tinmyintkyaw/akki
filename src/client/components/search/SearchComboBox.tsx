import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import typesenseDocument from "@/shared/types/typesense-document";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, CornerDownLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Highlight,
  Snippet,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { useNavigate } from "react-router-dom";

type HighlightResult = {
  value: string;
  matchLevel: string;
  matchedWords: string[];
};

type SnippetResult = {
  value: string;
  matchLevel: string;
  matchedWords: string[];
};

type MyHitType = typesenseDocument & {
  _snippetResult: Record<string, SnippetResult>;
  _highlightResult: Record<string, HighlightResult>;
};

type SearchComboBoxProps = {
  children: ReactNode;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const instantSearch = useInstantSearch({ catchError: true });
  const { refine, clear } = useSearchBox();
  const { hits } = useHits<MyHitType>();

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

  // Debounce Typesense search queries, not sure if it's necessary
  useEffect(() => {
    const timeout = setTimeout(() => {
      refine(input);
    }, 20);
    return () => clearTimeout(timeout);
  }, [input, refine]);

  // refetch key on expiry
  useEffect(() => {
    if (instantSearch.status !== "error") return;

    const timeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["searchAPIKey"] });
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [instantSearch.status, queryClient]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          clear();
          setInput(""); // reset search query on close
          setIsOpen((prev) => !prev);
        }}
      >
        <DialogTrigger asChild>{props.children}</DialogTrigger>

        <DialogContent className="p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={input}
              onValueChange={(value) => setInput(value)}
              onFocus={() => refine(input)}
            />
            <CommandList className="max-h-[calc(100vh-80px)] overflow-hidden md:max-h-[50vh]">
              {hits.length === 0 && (
                <CommandEmpty>No Results Found</CommandEmpty>
              )}

              <ScrollArea className="h-[calc(100vh-80px)] w-full md:h-[50vh]">
                {hits.map((hit) => {
                  return (
                    <CommandItem
                      key={hit.objectID}
                      value={hit.objectID}
                      className="flex w-full flex-col px-4 py-3"
                      onSelect={(value) => {
                        navigate(`/${value}`);
                        clear();
                        setIsOpen((prev) => !prev);
                      }}
                    >
                      <div className="w-full text-[15px] font-medium">
                        {hit._highlightResult?.pageName.matchedWords.length >
                        0 ? (
                          <Highlight
                            attribute={"pageName"}
                            hit={hit}
                            className=""
                            highlightedTagName={"strong"}
                            classNames={{
                              highlighted: "text-gray-950 dark:text-gray-100",
                              nonHighlighted:
                                "text-gray-800 dark:text-gray-400",
                            }}
                          />
                        ) : (
                          <span className="">{hit.pageName}</span>
                        )}
                      </div>

                      <div className="mt-1 w-full text-sm text-accent-foreground">
                        {instantSearch.indexUiState.query &&
                          hit._snippetResult?.textContent.matchedWords.length >
                            0 && (
                            <Snippet
                              attribute={"textContent"}
                              hit={hit}
                              highlightedTagName={"strong"}
                              className="mt-2"
                              classNames={{
                                highlighted: "text-gray-950 dark:text-gray-100",
                                nonHighlighted:
                                  "text-gray-800 dark:text-gray-400",
                              }}
                            />
                          )}
                      </div>
                    </CommandItem>
                  );
                })}
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
