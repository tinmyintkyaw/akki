import AppHome from "@/components/Main";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function App() {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading</div>;
  if (status === "unauthenticated") router.push("/signin");
  if (status === "authenticated") return <AppHome />;
}
