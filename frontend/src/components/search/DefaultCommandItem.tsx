import { CommandItem } from "@/components/ui/command";
import useStore from "@/zustand/store";
import { MeilisearchPage } from "@project/shared-types";
import { Hit } from "instantsearch.js";
import { getHighlightedParts } from "instantsearch.js/es/lib/utils";
import { ChevronRight, CornerDownLeft, FileText } from "lucide-react";
import { Highlight } from "react-instantsearch";
import { useNavigate } from "react-router-dom";

interface DefaultCommandItemProps {
  hit: Hit<MeilisearchPage>;
  transformedHits: Hit<MeilisearchPage>[];
  index: number;
  setDetailHit: (hit: Hit<MeilisearchPage>) => void;
}

function DefaultCommandItem(props: DefaultCommandItemProps) {
  const { hit, transformedHits, index, setDetailHit } = props;
  const navigate = useNavigate();

  const setIsCmdPaletteOpen = useStore((store) => store.setIsCmdPaletteOpen);

  return (
    <CommandItem
      value={hit.id}
      className="flex w-full items-center gap-2 rounded-none px-4 py-3"
      onSelect={(value) => {
        const textContent = transformedHits[index]._snippetResult
          ?.textContent as [];

        if (textContent.length > 1) {
          setDetailHit(hit);
        } else {
          navigate(`/${value}`);
          setIsCmdPaletteOpen(false);
        }
      }}
    >
      <div className="w-full">
        <div className="flex w-full items-center gap-2 text-[15px] font-medium">
          <FileText className="h-4 w-4" />
          <Highlight
            attribute={"pageName"}
            hit={hit}
            className="line-clamp-1"
            highlightedTagName={"strong"}
            classNames={{
              highlighted: "text-gray-950 dark:text-gray-100",
              nonHighlighted: "text-gray-800 dark:text-gray-200",
            }}
          />
        </div>

        {Array.isArray(hit._snippetResult?.textContent) &&
          hit._snippetResult.textContent.length >= 1 && (
            <div className="w-full pl-6 text-sm font-medium">
              <p className="line-clamp-2">
                {getHighlightedParts(
                  // @ts-expect-error TODO: typings for snippetResult
                  hit._snippetResult.textContent[0].text.value,
                ).map((item, index) =>
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
          )}
      </div>

      {/* @ts-expect-error TODO: typings for snippetResult */}
      {hit._snippetResult?.textContent.length > 1 ? (
        <ChevronRight className="h-5 w-5" />
      ) : (
        <CornerDownLeft className="h-3 w-3 text-muted-foreground" />
      )}
    </CommandItem>
  );
}

export default DefaultCommandItem;
