import { useQuery } from "@tanstack/react-query";

const useSearchAPIKey = () => {
  return useQuery({
    queryKey: ["searchAPIKey"],
    queryFn: async (): Promise<{ key: string }> => {
      const response = await fetch("/api/search/key");
      if (!response.ok) throw new Error("Failed to get search API key");

      const json: { key: string } = await response.json();
      return json;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useSearchAPIKey;
