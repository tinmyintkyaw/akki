import * as Dialog from "@radix-ui/react-dialog";
import { Combobox } from "@headlessui/react";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  Snippet,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import { useRouter } from "next/router";
import { ArrowDownUp, CornerDownLeft, Search, XCircle } from "lucide-react";

import useSearchAPIKey from "@/hooks/useSearchAPIKey";

import { inter } from "@/pages/_app";

type SearchComboBoxProps = {
  children: ReactNode;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const router = useRouter();
  const instantSearch = useInstantSearch({ catchError: true });
  const { query, refine, clear } = useSearchBox();
  const { hits } = useHits();

  const searchAPIKeyQuery = useSearchAPIKey();

  // If the search API key is not available or expired, refetch it
  useEffect(() => {
    if (instantSearch.status !== "error") return;
    // if (
    //   !(instantSearch.error instanceof Error) ||
    //   instantSearch.error.name !== "RequestUnauthorized"
    // )
    //   return;

    searchAPIKeyQuery.refetch();
  }, [instantSearch.status, instantSearch.error, searchAPIKeyQuery]);

  const [isOpen, setIsOpen] = useState(false);

  // Open the search combox with keyboard shortcut
  useEffect(() => {
    function handleKeyDown(event: any) {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50">
          <Dialog.Content
            onCloseAutoFocus={(event) => event.preventDefault()}
            className={`${inter.className} mx-auto mt-[10vh] max-h-[80vh] max-w-[90vw] rounded bg-popover focus:outline-none md:max-w-2xl`}
          >
            <Combobox
              as={Fragment}
              onChange={(event: any) => {
                router.push(`/${event.id}`);
                clear();
              }}
            >
              <div className="flex h-14 items-center border-b-2 px-3">
                <Search className="h-6 w-6 text-muted-foreground" />

                <Combobox.Input
                  autoFocus
                  autoComplete="off"
                  placeholder="Search..."
                  displayValue={() => query}
                  onChange={(event) => {
                    refine(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      clear();
                    }
                  }}
                  className={`h-full w-full border-0 bg-transparent px-2 text-lg focus:outline-none`}
                />

                {instantSearch.indexUiState.query && (
                  <button onClick={clear}>
                    <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  </button>
                )}
              </div>

              <Combobox.Options
                static
                as="div"
                className="h-full max-h-[calc(80vh-5.5rem)] select-none overflow-y-auto bg-transparent px-1 py-1 scrollbar-thin scrollbar-thumb-gray-400"
              >
                {hits.map((hit) => {
                  return (
                    <Combobox.Option
                      key={hit.objectID}
                      as={Fragment}
                      value={hit}
                    >
                      {({ active }) => {
                        return (
                          <div
                            className={`flex flex-col justify-center rounded px-2 py-2 text-foreground ${
                              active ? "bg-accent" : "bg-transparent"
                            }`}
                          >
                            <Snippet
                              attribute="pageName"
                              hit={hit}
                              className="line-clamp-1 font-medium"
                            />

                            {instantSearch.indexUiState.query && (
                              <Snippet
                                attribute="pageTextContent"
                                hit={hit}
                                className="mt-1 line-clamp-2 text-sm text-foreground"
                              />
                            )}
                          </div>
                        );
                      }}
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            </Combobox>

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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
