import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const { status } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") navigate("/");
  }, [navigate, status]);

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center gap-2">
      {status === "unauthenticated" && (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Sign In</h1>

          <Button variant={"outline"} size={"default"} asChild>
            <Link to={"/api/signin/google"} reloadDocument className="w-64">
              <span>{`Continue with Google`}</span>
            </Link>
          </Button>

          <Button variant={"outline"} size={"default"} asChild>
            <Link to={"/api/signin/github"} reloadDocument className="w-64">
              <span>{`Continue with GitHub`}</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

export default Signin;
