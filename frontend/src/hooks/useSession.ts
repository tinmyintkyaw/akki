import SessionResponse from "@/shared/types/session-response";
import { useQuery } from "@tanstack/react-query";

export const sessionQueryFn = async () => {
  const response = await fetch("/api/session");
  if (!response.ok) throw new Error("Auth failed");

  const session: SessionResponse = await response.json();
  return { session };
};

export const useSession = (): {
  status: "loading" | "authenticated" | "unauthenticated";
  session?: SessionResponse | null;
} => {
  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: sessionQueryFn,
    retry: false,
    // refetchInterval: 5 * 60 * 1000,
  });

  return {
    status: sessionQuery.isLoading
      ? "loading"
      : sessionQuery.isSuccess
      ? "authenticated"
      : "unauthenticated",
    session: sessionQuery.isLoading
      ? undefined
      : sessionQuery.isSuccess
      ? sessionQuery.data.session
      : null,
  };
};
