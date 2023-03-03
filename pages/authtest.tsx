import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthTest() {
  const session = useSession();

  useEffect(() => {
    getSession().then((session) => console.log(session));
  }, [session]);

  return (
    <>
      {session.data ? <p>Signed In</p> : <p>Signed Out</p>}
      {session.data ? (
        <button onClick={() => signOut()} className="bg-teal-200 p-2">
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn()} className="bg-teal-200 p-2">
          Sign In
        </button>
      )}
    </>
  );
}
