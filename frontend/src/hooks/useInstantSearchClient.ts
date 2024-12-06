import { authClient } from "@/authClient";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useMemo } from "react";

const useInstantSearchClient = () => {
  const session = authClient.useSession();

  const instantMeilisearchClient = useMemo(
    () =>
      instantMeiliSearch(
        `${window.location.host}/api/search`,
        // "",
        () =>
          !session.isPending && !session.error && session.data
            ? session.data.session.searchToken
            : "",
      ),
    [session.data, session.error, session.isPending],
  );

  return instantMeilisearchClient.searchClient;
};

export default useInstantSearchClient;
