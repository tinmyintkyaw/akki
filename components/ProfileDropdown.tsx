import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import {
  HiArrowRightOnRectangle,
  HiCog8Tooth,
  HiSun,
  HiUser,
} from "react-icons/hi2";
import MenuButton from "@/components/MenuButton";

type ProfileDropdownProps = {};

export default function ProfileDropdown(props: ProfileDropdownProps) {
  const session = useSession();

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger className="mx-2 flex h-10 select-none flex-row items-center gap-2 rounded px-2 text-sm focus:outline-none hover:bg-stone-300">
        {session.data &&
          session.data.user?.name &&
          session.data.user?.email &&
          session.data.user?.image && (
            <>
              <Avatar.Root>
                <Avatar.Image
                  src={session.data.user.image}
                  alt={session.data.user.name}
                  className="h-6 w-6 rounded-full"
                />
              </Avatar.Root>

              <p className="font-medium line-clamp-1">
                {session.data.user?.name}
              </p>
            </>
          )}
      </RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          side="top"
          align="end"
          className="z-50 flex w-56 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow"
        >
          <RadixDropdown.Item asChild>
            <MenuButton icon={HiSun} text="Change Theme" onClick={() => {}} />
          </RadixDropdown.Item>

          <RadixDropdown.Item asChild>
            <MenuButton icon={HiUser} text="Profile" onClick={() => {}} />
          </RadixDropdown.Item>

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={HiCog8Tooth}
              text="Preferences"
              onClick={() => {}}
            />
          </RadixDropdown.Item>

          <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={HiArrowRightOnRectangle}
              text="Sign Out"
              onClick={signOut}
            />
          </RadixDropdown.Item>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
