import * as Dialog from "@radix-ui/react-dialog";
import { Combobox } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import {
  Highlight,
  Hits,
  SearchBox,
  Snippet,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXCircle,
  HiXCircle,
} from "react-icons/hi2";
import { inter } from "@/pages/_app";
import { useRouter } from "next/router";

type SearchComboBoxProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function SearchComboBox(props: SearchComboBoxProps) {
  const router = useRouter();
  const { query, refine, clear } = useSearchBox();
  const { hits } = useHits();

  useEffect(() => {
    console.log({ hits });
  }, [hits]);

  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50">
          <Dialog.Content
            className={`${inter.className} mx-auto mt-[10vh] max-h-[80vh] max-w-[90vw] rounded bg-stone-100 focus:outline-none md:max-w-2xl`}
          >
            <Combobox onChange={(event) => router.push(`/page/${event.id}`)}>
              <div className="flex items-center border-b-2 py-4 px-3">
                <HiOutlineMagnifyingGlass className="h-6 w-6 text-gray-500" />

                <Combobox.Input
                  autoFocus
                  placeholder="Search..."
                  displayValue={() => query}
                  onChange={(event) => {
                    refine(event.target.value);
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
                            <h2 className="font-medium">{hit.pageName}</h2>
                            <Snippet
                              attribute="pageTextContent"
                              hit={hit}
                              className="text-sm"
                            />
                          </div>
                        );
                      }}
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            </Combobox>
            <div className="h-6 w-full border-t-2"></div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
