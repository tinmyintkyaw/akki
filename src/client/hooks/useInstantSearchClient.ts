import { useMemo } from "react";
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
  const instantSearchAdapter = useMemo(
    () => new TypesenseInstantsearchAdapter(typesenseAdapterOptions),
    [],
  );

  return instantSearchAdapter.searchClient;
};

export default useInstantSearchClient;
