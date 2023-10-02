import { useSession } from "@/hooks/useSession";
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
