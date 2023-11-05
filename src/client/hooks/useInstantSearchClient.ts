import useSearchKeyQuery from "@/hooks/useSearchKeyQuery";
import { useEffect, useMemo } from "react";
import TypesenseInstantsearchAdapter, {
  TypesenseInstantsearchAdapterOptions,
} from "typesense-instantsearch-adapter";

const typesenseAdapterOptions: TypesenseInstantsearchAdapterOptions = {
  server: {
    apiKey: "",
    nodes: [
      {
        url: `/api/search`,
      },
    ],
    sendApiKeyAsQueryParam: false,
  },
  additionalSearchParameters: {
    query_by: "pageName,textContent",
  },
};

const useInstantSearchClient = () => {
  const searchKeyQuery = useSearchKeyQuery();

  const instantSearchAdapter = useMemo(
    () => new TypesenseInstantsearchAdapter(typesenseAdapterOptions),
    [],
  );

  useEffect(() => {
    if (searchKeyQuery.isLoading || searchKeyQuery.isError) return;

    instantSearchAdapter.updateConfiguration({
      ...typesenseAdapterOptions,
      server: {
        ...typesenseAdapterOptions.server,
        apiKey: searchKeyQuery.data.searchKey,
      },
    });
  }, [
    instantSearchAdapter,
    searchKeyQuery.data,
    searchKeyQuery.isError,
    searchKeyQuery.isLoading,
  ]);

  return instantSearchAdapter.searchClient;
};

export default useInstantSearchClient;
