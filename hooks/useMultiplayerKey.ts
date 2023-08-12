import { useQuery } from "@tanstack/react-query";

const useMultiplayerKey = () => {
  return useQuery({
    queryKey: ["multiplayerKey"],
    queryFn: async (): Promise<{ collabToken: string }> => {
      const response = await fetch("/api/collab/token");
      if (!response.ok) throw new Error("Failed to get multiplayer key");

      const json: { collabToken: string } = await response.json();
      return json;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useMultiplayerKey;
