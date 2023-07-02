import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import {
  MdCheck,
  MdLogout,
  MdOutlineAccountCircle,
  MdOutlineLightMode,
  MdOutlineSettings,
} from "react-icons/md";

import MenuButton from "@/components/MenuButton";
import clsx from "clsx";
import { inter } from "@/pages/_app";

type ProfileDropdownProps = {};

export default function ProfileDropdown(props: ProfileDropdownProps) {
  const session = useSession();

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger className="flex select-none flex-row items-center gap-2 rounded-full p-1 text-sm focus:outline-none hover:bg-stone-300">
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

                <Avatar.Fallback asChild>
                  <MdOutlineAccountCircle className="h-6 w-6 rounded-full" />
                </Avatar.Fallback>
              </Avatar.Root>
            </>
          )}
      </RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          side="bottom"
          sideOffset={5}
          align="end"
          className="z-50 flex w-56 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-md"
        >
          <div
            className={clsx(
              inter.className,
              "flex select-none flex-row items-center gap-2 rounded px-2 py-3 focus:outline-none"
            )}
          >
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

                    <Avatar.Fallback asChild>
                      <MdOutlineAccountCircle className="h-6 w-6 rounded-full" />
                    </Avatar.Fallback>
                  </Avatar.Root>

                  <p className="line-clamp-1 font-medium">
                    {session.data.user?.name}
                  </p>
                </>
              )}
          </div>

          <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixDropdown.Sub>
            <RadixDropdown.SubTrigger asChild>
              <MenuButton text="Change Theme">
                <MdOutlineLightMode className="h-4 w-4" />
              </MenuButton>
            </RadixDropdown.SubTrigger>

            <RadixDropdown.Portal>
              <RadixDropdown.SubContent
                alignOffset={-7}
                sideOffset={5}
                className="z-50 flex w-56 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-md"
              >
                <RadixDropdown.RadioGroup value="light">
                  <RadixDropdown.RadioItem value={"light"} asChild>
                    <MenuButton text="Light">
                      <RadixDropdown.ItemIndicator asChild>
                        <MdCheck className="h-4 w-4" />
                      </RadixDropdown.ItemIndicator>
                    </MenuButton>
                  </RadixDropdown.RadioItem>

                  <RadixDropdown.RadioItem value={"dark"} asChild>
                    <MenuButton text="Dark">
                      <RadixDropdown.ItemIndicator asChild>
                        <MdCheck className="h-4 w-4" />
                      </RadixDropdown.ItemIndicator>
                    </MenuButton>
                  </RadixDropdown.RadioItem>

                  <RadixDropdown.RadioItem value={"system"} asChild>
                    <MenuButton text="System">
                      <RadixDropdown.ItemIndicator asChild>
                        <MdCheck className="h-4 w-4" />
                      </RadixDropdown.ItemIndicator>
                    </MenuButton>
                  </RadixDropdown.RadioItem>
                </RadixDropdown.RadioGroup>
              </RadixDropdown.SubContent>
            </RadixDropdown.Portal>
          </RadixDropdown.Sub>

          <RadixDropdown.Item asChild>
            <MenuButton text="Preferences" onClick={() => {}}>
              <MdOutlineSettings className="h-4 w-4" />
            </MenuButton>
          </RadixDropdown.Item>

          <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixDropdown.Item asChild>
            <MenuButton text="Sign Out" onClick={signOut}>
              <MdLogout className="h-4 w-4" />
            </MenuButton>
          </RadixDropdown.Item>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
