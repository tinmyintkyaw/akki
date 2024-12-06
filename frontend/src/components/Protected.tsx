import { authClient } from "@/authClient";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
}

const Protected = (props: ProtectedProps) => {
  const session = authClient.useSession();

  if (session.isPending) {
    return <></>;
  } else {
    if (session.data) {
      return props.children;
    } else {
      return <Navigate to={"/signin"} />;
    }
  }
};

export default Protected;
