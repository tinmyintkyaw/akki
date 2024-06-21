import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useInstantSearchClient = () => {
  const searchTokenQuery = useQuery({
    queryKey: ["searchToken"],
    queryFn: async () => {
      const response = await fetch("/api/auth/search/token");
      if (!response.ok) throw new Error();

      const json: { searchToken: string } = await response.json();
      return json.searchToken;
    },
    // staleTime: 59 * 60 * 1000,
    refetchInterval: 10 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const instantMeilisearchClient = useMemo(
    () =>
      instantMeiliSearch(`${window.location.host}/api/test`, () => {
        if (
          searchTokenQuery.isLoading ||
          searchTokenQuery.isError ||
          !searchTokenQuery.data
        ) {
          return "";
        } else {
          return searchTokenQuery.data;
        }
      }),
    [
      searchTokenQuery.data,
      searchTokenQuery.isError,
      searchTokenQuery.isLoading,
    ],
  );

  return instantMeilisearchClient.searchClient;
};

export default useInstantSearchClient;
