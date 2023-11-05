import { useQuery } from "@tanstack/react-query";

const searchKeyQueryFn = async () => {
  const response = await fetch("/api/keys/search");
  if (!response.ok) throw new Error("Auth failed");

  const json: { searchKey: string } = await response.json();
  return json;
};

const useSearchKeyQuery = () => {
  return useQuery({
    queryKey: ["searchKey"],
    queryFn: searchKeyQueryFn,
    refetchInterval: 15 * 60 * 1000,
  });
};

export default useSearchKeyQuery;
