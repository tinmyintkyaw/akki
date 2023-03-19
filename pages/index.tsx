import { useRouter } from "next/router";
import { Roboto_Flex } from "@next/font/google";
import { useSession } from "next-auth/react";

const roboto = Roboto_Flex({
  subsets: ["latin"],
});

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("/page");
  }

  if (session.status === "unauthenticated") {
    return <p>Index</p>;
  }
}
