import { useQuery } from "@tanstack/react-query";

const useSearchAPIKey = () => {
  return useQuery({
    queryKey: ["searchAPIKey"],
    queryFn: async () => {
      const response = await fetch("/api/search/key");
      if (!response.ok) throw new Error("Failed to get search API key");
      return response.json();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useSearchAPIKey;
