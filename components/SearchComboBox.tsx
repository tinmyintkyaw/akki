import * as Dialog from "@radix-ui/react-dialog";
import { Combobox } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import {
  Snippet,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import { useRouter } from "next/router";
import {
  HiArrowsUpDown,
  HiOutlineMagnifyingGlass,
  HiXCircle,
} from "react-icons/hi2";
import { MdKeyboardReturn } from "react-icons/md";

import { inter } from "@/pages/_app";

type SearchComboBoxProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const router = useRouter();
  const instantSearch = useInstantSearch();
  const { query, refine, clear } = useSearchBox();
  const { hits } = useHits();

  useEffect(() => {
    console.log({ hits, instantSearch });
  }, [hits, instantSearch]);

  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50">
          <Dialog.Content
            className={`${inter.className} mx-auto mt-[10vh] max-h-[80vh] max-w-[90vw] rounded bg-stone-100 focus:outline-none md:max-w-2xl`}
          >
            <Combobox
              as="div"
              onChange={(event) => {
                router.push(`/page/${event.id}`);
                clear();
                props.onOpenChange(false);
              }}
            >
              <div className="flex items-center border-b-2 py-4 px-3">
                <HiOutlineMagnifyingGlass className="h-6 w-6 text-gray-500" />

                <Combobox.Input
                  autoFocus
                  placeholder="Search..."
                  displayValue={() => query}
                  onChange={(event) => {
                    refine(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      clear();
                      props.onOpenChange(false);
                    }
                  }}
                  className={`h-full w-full border-0 bg-transparent px-2 text-lg focus:outline-none`}
                />

                <button onClick={clear}>
                  <HiXCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              </div>

              <Combobox.Options
                static
                as="div"
                className="h-full max-h-[calc(80vh-5rem)] overflow-y-auto bg-transparent px-1 py-1 scrollbar-thin scrollbar-thumb-gray-400"
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
                            className={`flex flex-col justify-center rounded py-2 px-2 text-gray-600 ${
                              active ? "bg-slate-300" : "bg-transparent"
                            }`}
                          >
                            <Snippet
                              attribute="pageName"
                              hit={hit}
                              className="font-medium"
                            />

                            {instantSearch.indexUiState.query && (
                              <Snippet
                                attribute="pageTextContent"
                                hit={hit}
                                className="mt-1 text-sm"
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

            <div className="flex h-8 items-center gap-2 border-t-2 px-2">
              <li className="flex h-full flex-row items-center gap-1">
                <HiArrowsUpDown className="h-3 w-3" />
                <p className="text-xs text-gray-800">Select</p>
              </li>
              <li className="flex h-full flex-row items-center gap-1">
                <MdKeyboardReturn className="h-3 w-3" />
                <p className="text-xs text-gray-800">Open</p>
              </li>
              <li className="flex h-full flex-row items-center gap-1">
                <p className="text-xs font-medium">Esc</p>
                <p className="text-xs text-gray-800">Dismiss</p>
              </li>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
