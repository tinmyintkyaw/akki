import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("/page");
  }

  if (session.status === "unauthenticated") {
    // TODO: Landing page
    // return <p>Index</p>;
    router.push("/api/auth/login");
  }
}
