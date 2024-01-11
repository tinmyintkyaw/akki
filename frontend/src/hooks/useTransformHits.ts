import { MeilisearchPage } from "@project/shared-types";
import { Hit, HitAttributeSnippetResult } from "instantsearch.js";
import { getHighlightedParts, unescape } from "instantsearch.js/es/lib/utils";
import { useEffect, useState } from "react";

const useTransformHits = (hits: Hit<MeilisearchPage>[]) => {
  const [transformedHits, setTransformedHits] = useState<typeof hits>([]);

  useEffect(() => {
    if (hits.length <= 0) return;

    const prunedHits = hits.map((hit) => {
      const textContentSnippet = hit._snippetResult?.textContent as {
        text: HitAttributeSnippetResult;
      }[];

      const prunedTextContentSnippet = textContentSnippet?.filter((item) =>
        getHighlightedParts(item.text.value).some(
          (value) => value.isHighlighted,
        ),
      );

      const unescapedSnippets = prunedTextContentSnippet.map((item) => ({
        ...item,
        text: { ...item.text, value: unescape(item.text.value) },
      }));

      return {
        ...hit,
        _snippetResult: {
          ...hit._snippetResult,
          textContent: unescapedSnippets,
        },
      };
    });

    setTransformedHits(prunedHits);
  }, [hits]);

  return transformedHits;
};

export default useTransformHits;
