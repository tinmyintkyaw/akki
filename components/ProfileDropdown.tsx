import * as Avatar from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import {
  LogOut,
  PanelLeftClose,
  Settings,
  SunMoon,
  UserCircle,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ProfileDropdownProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: () => void;
};

export default function ProfileDropdown(props: ProfileDropdownProps) {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenu>
        <div className="flex items-center gap-2 pr-2">
          <DropdownMenuTrigger className="flex h-12 flex-grow select-none flex-row items-center gap-2 rounded px-4 text-sm focus:outline-none radix-state-open:bg-accent hover:bg-accent">
            <p className="text-lg font-medium">Project Potion</p>
          </DropdownMenuTrigger>

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={props.setIsSidebarOpen}
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>

        <DropdownMenuContent className="w-64">
          <div className="flex select-none flex-row items-center gap-2 rounded px-2 py-3 focus:outline-none">
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

                    <Avatar.Fallback>
                      <UserCircle className="h-6 w-6 rounded-full" />
                    </Avatar.Fallback>
                  </Avatar.Root>

                  <p className="line-clamp-1 font-medium">
                    {session.data.user?.name}
                  </p>
                </>
              )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Change Theme</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <span>Light</span>
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="dark">
                  <span>Dark</span>
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="system">
                  <span>System</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
