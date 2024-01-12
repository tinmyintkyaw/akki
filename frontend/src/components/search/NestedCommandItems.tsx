import { CommandItem, CommandShortcut } from "@/components/ui/command";
import useStore from "@/zustand/store";
import { MeilisearchPage } from "@project/shared-types";
import { Hit, HitAttributeSnippetResult } from "instantsearch.js";
import { getHighlightedParts } from "instantsearch.js/es/lib/utils";
import { ChevronLeft, CornerDownLeft, Text } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface DefaultCommandItemProps {
  hit: Hit<MeilisearchPage>;
  transformedHits: Hit<MeilisearchPage>[];
  setDetailHit: (detailHit: Hit<MeilisearchPage> | null) => void;
}

function NestedCommandItem(props: DefaultCommandItemProps) {
  const { hit, setDetailHit } = props;
  const navigate = useNavigate();
  const params = useParams();

  const setIsCmdPaletteOpen = useStore((store) => store.setIsCmdPaletteOpen);
  const setEditorCursor = useStore((store) => store.setEditorSelection);

  const textContent = hit._snippetResult
    ?.textContent as HitAttributeSnippetResult[];

  useEffect(() => {
    // @ts-expect-error TODO: typings for snippetResult
    if (hit._snippetResult.textContent.length < 1) setDetailHit(null);
  }, [hit, setDetailHit]);

  return (
    <>
      <CommandItem
        value={"back"}
        onSelect={() => setDetailHit(null)}
        className="flex w-full items-center gap-2 rounded-none px-4 py-3"
      >
        <ChevronLeft className="h-4 w-4" />
        <p className="w-full text-sm font-medium">Back</p>
      </CommandItem>

      {textContent.map((item, index) => (
        <CommandItem
          key={index}
          value={index.toString()}
          className="flex w-full items-center gap-2 rounded-none px-4 py-3"
          onSelect={() => {
            navigate(`/${hit.id}`);
            setEditorCursor({
              // @ts-expect-error TODO: typings for snippetResult
              start: item.posStart.value,
              // @ts-expect-error TODO: typings for snippetResult
              end: item.posEnd.value,
              pageChanged: hit.id === params.pageId ? false : true,
            });
            setIsCmdPaletteOpen(false);
          }}
        >
          <CommandShortcut>
            <Text className="h-4 w-4" />
          </CommandShortcut>

          <div className="w-full text-sm font-medium">
            <p className="line-clamp-1">
              {/* @ts-expect-error TODO: typings for snippetResult */}
              {getHighlightedParts(item.text.value).map((item, index) =>
                item.isHighlighted ? (
                  <strong
                    key={index}
                    className="text-gray-950 dark:text-gray-100"
                  >
                    {item.value}
                  </strong>
                ) : (
                  <span
                    key={index}
                    className="text-gray-800 dark:text-gray-400"
                  >
                    {item.value}
                  </span>
                ),
              )}
            </p>
          </div>

          <CornerDownLeft className="text-muted-foreground h-3 w-3" />
        </CommandItem>
      ))}
    </>
  );
}

export default NestedCommandItem;
