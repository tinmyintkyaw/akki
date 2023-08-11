import { ReactNode, useEffect, useState } from "react";
import {
  Snippet,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import { useRouter } from "next/router";
import { ArrowDownUp, CornerDownLeft, Search, XCircle } from "lucide-react";

import useSearchAPIKey from "@/hooks/useSearchAPIKey";

import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type SearchComboBoxProps = {
  children: ReactNode;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const router = useRouter();
  const instantSearch = useInstantSearch({ catchError: true });
  const { query, refine, clear } = useSearchBox();
  const { hits } = useHits();

  const searchAPIKeyQuery = useSearchAPIKey();

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

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          clear();
          setInput(""); // reset search query on close
          setIsOpen((prev) => !prev);
        }}
      >
        <DialogTrigger asChild>{props.children}</DialogTrigger>

        <DialogContent className="p-0">
          <Command shouldFilter={false} loop={true}>
            <CommandInput
              placeholder="Search..."
              value={input}
              onValueChange={(value) => setInput(value)}
              onFocus={(e) => refine("")}
            />
            <CommandList className="max-h-[calc(100vh-80px)] scrollbar-none md:max-h-[50vh]">
              <CommandEmpty>No Results Found</CommandEmpty>

              {instantSearch.error && <CommandEmpty>Loading...</CommandEmpty>}

              <ScrollArea className="h-[calc(100vh-80px)] w-full md:h-[50vh]">
                {!instantSearch.error &&
                  hits.map((hit) => (
                    <CommandItem
                      key={hit.objectID}
                      value={hit.objectID}
                      className="flex flex-col"
                      onSelect={(value) => {
                        router.push(`/${value}`);
                        clear();
                      }}
                    >
                      <Snippet
                        attribute="pageName"
                        hit={hit}
                        className="my-2 w-full truncate px-2 text-start font-medium"
                      />

                      {instantSearch.indexUiState.query && (
                        <Snippet
                          attribute="pageTextContent"
                          hit={hit}
                          className="mb-2 line-clamp-2 w-full px-2 text-start text-sm text-foreground"
                        />
                      )}
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
