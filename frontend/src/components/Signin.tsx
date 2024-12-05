import { authClient } from "@/authClient";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const githubSignin = async () => {
  await authClient.signIn.social(
    {
      provider: "github",
      callbackURL: "/",
    },
    { onSuccess: () => console.log("success") },
  );
  // await authClient.signOut();
};

function Signin() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!session.isPending && session.data) navigate("/");
  }, [navigate, session.data, session.isPending]);

  useEffect(() => console.log(session), [session]);

  // const { status } = useSession();
  // useEffect(() => {
  //   if (status === "authenticated") navigate("/");
  // }, [navigate, status]);

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center gap-2">
      {!session.data && (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Sign In</h1>

          <Button variant={"outline"} size={"default"} asChild>
            <Link to={"/api/signin/google"} reloadDocument className="w-64">
              <span>{`Continue with Google`}</span>
            </Link>
          </Button>

          <Button
            variant={"outline"}
            size={"default"}
            // asChild
            onClick={githubSignin}
          >
            {/* <Link to={"/api/signin/github"} reloadDocument className="w-64"> */}
            <span className="w-56">{`Continue with GitHub`}</span>
            {/* </Link> */}
          </Button>
        </>
      )}
    </div>
  );
}

export default Signin;
