import { signOut, useSession } from "next-auth/react";
import * as Avatar from "@radix-ui/react-avatar";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function Profile() {
  const session = useSession();

  return (
    <div className="flex h-12 w-full items-center gap-2 border-t-2 px-4">
      {session.data && (
        <>
          <Avatar.Root>
            <Avatar.Image
              src={session.data.user?.image || ""}
              alt="User Profile Picture"
              className="h-6 w-6 rounded-full"
            />
            <Avatar.Fallback></Avatar.Fallback>
          </Avatar.Root>

          <p className="flex-grow font-medium">{session.data?.user?.name}</p>

          <button
            // TODO: Add a confirmation dialog
            onClick={() => signOut()}
            className="rounded-full p-2 hover:bg-stone-200"
          >
            <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
