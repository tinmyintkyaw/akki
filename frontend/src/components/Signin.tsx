import { authClient } from "@/authClient";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const githubSignin = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
  });
};

const googleSignin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

function Signin() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session.isPending && session.data) navigate("/");
  }, [navigate, session.data, session.isPending]);

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center gap-2">
      {!session.data && (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Sign In</h1>

          <Button variant={"outline"} size={"default"} onClick={googleSignin}>
            <span className="w-56">{`Continue with Google`}</span>
          </Button>

          <Button variant={"outline"} size={"default"} onClick={githubSignin}>
            <span className="w-56">{`Continue with GitHub`}</span>
          </Button>
        </>
      )}
    </div>
  );
}

export default Signin;
