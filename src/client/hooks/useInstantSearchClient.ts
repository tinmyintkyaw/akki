import { useSession } from "@/hooks/useSession";
import { useEffect, useMemo } from "react";
import TypesenseInstantsearchAdapter, {
  TypesenseInstantsearchAdapterOptions,
} from "typesense-instantsearch-adapter";

// TODO: dynamically get url from the server
const TYPESENSE_HOST = "localhost";
const TYPESENSE_PROTOCOL = "http";
const TYPESENSE_PORT = 8108;

const typesenseAdapterOptions: TypesenseInstantsearchAdapterOptions = {
  server: {
    apiKey: "",
    nodes: [
      {
        host: TYPESENSE_HOST,
        port: TYPESENSE_PORT,
        protocol: TYPESENSE_PROTOCOL,
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "pageName,textContent",
  },
};

const useInstantSearchClient = () => {
  const { session } = useSession();

  const instantSearchAdapter = useMemo(
    () => new TypesenseInstantsearchAdapter(typesenseAdapterOptions),
    [],
  );

  useEffect(() => {
    if (!session) return;

    instantSearchAdapter.updateConfiguration({
      ...typesenseAdapterOptions,
      server: {
        ...typesenseAdapterOptions.server,
        apiKey: session.searchKey,
      },
    });
  }, [instantSearchAdapter, session]);

  return instantSearchAdapter.searchClient;
};

export default useInstantSearchClient;
