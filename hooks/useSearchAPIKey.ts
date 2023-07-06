import { typesenseInstantSearchAdaptor } from "@/pages/[pageId]";
import { useQuery } from "@tanstack/react-query";

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT
  ? parseInt(process.env.TYPESENSE_PORT)
  : 8108;

const useSearchAPIKey = () => {
  return useQuery({
    queryKey: ["searchAPIKey"],
    queryFn: async () => {
      const response = await fetch("/api/search/key");
      if (!response.ok) throw new Error("Failed to get search API key");

      const json = await response.json();
      typesenseInstantSearchAdaptor.updateConfiguration({
        server: {
          apiKey: json.key,
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
      });

      return json;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useSearchAPIKey;
