import { useEffect, useMemo } from "react";
import TypesenseInstantsearchAdapter, {
  TypesenseInstantsearchAdapterOptions,
} from "typesense-instantsearch-adapter";
import useSearchAPIKey from "./useSearchAPIKey";

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT
  ? parseInt(process.env.TYPESENSE_PORT)
  : 8108;

const typesenseAdapterOptions: TypesenseInstantsearchAdapterOptions = {
  server: {
    apiKey: "",
    nodes: [
      {
        host: TYPESENSE_HOST,
        port: TYPESENSE_PORT,
        protocol: "http",
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "pageName,pageTextContent",
  },
};

const useInstantSearchClient = () => {
  const searchAPIKeyQuery = useSearchAPIKey();

  const instantSearchAdapter = useMemo(
    () => new TypesenseInstantsearchAdapter(typesenseAdapterOptions),
    []
  );

  useEffect(() => {
    if (searchAPIKeyQuery.isLoading || searchAPIKeyQuery.isError) return;

    instantSearchAdapter.updateConfiguration({
      ...typesenseAdapterOptions,
      server: {
        ...typesenseAdapterOptions.server,
        apiKey: searchAPIKeyQuery.data.key,
      },
    });
  }, [
    instantSearchAdapter,
    searchAPIKeyQuery.data,
    searchAPIKeyQuery.isError,
    searchAPIKeyQuery.isLoading,
  ]);

  return instantSearchAdapter.searchClient;
};

export default useInstantSearchClient;
