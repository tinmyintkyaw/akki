import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function GlobalError() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Something went wrong!</h1>
      <Button onClick={() => navigate("/")}>Back To Home</Button>
    </div>
  );
}
