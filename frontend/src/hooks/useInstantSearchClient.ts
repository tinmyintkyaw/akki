import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useMemo } from "react";

const useInstantSearchClient = () => {
  const instantMeilisearchClient = useMemo(
    () => instantMeiliSearch(`${window.location.host}/api/search`, ""),
    [],
  );

  return instantMeilisearchClient.searchClient;
};

export default useInstantSearchClient;
