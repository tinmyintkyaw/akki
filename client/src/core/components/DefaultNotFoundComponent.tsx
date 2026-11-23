import { Navigate } from "@tanstack/react-router";

export function DefaultNotFoundComponent() {
  return <Navigate to="/" replace />;
}
