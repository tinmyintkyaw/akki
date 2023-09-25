import { useSession } from "@/hooks/useSession";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
}

const Protected = (props: ProtectedProps) => {
  const { status } = useSession();

  switch (status) {
    case "unauthenticated":
      return <Navigate to={"/signin"} />;

    case "authenticated":
      return props.children;

    case "loading":
      return <></>;
  }
};

export default Protected;
