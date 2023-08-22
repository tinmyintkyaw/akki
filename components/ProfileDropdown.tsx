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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
import SettingsComponent from "./Settings";

const ProfileDropdown = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="rounded-full">
              {session.data &&
                session.data.user?.name &&
                session.data.user?.email &&
                session.data.user?.image && (
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
                )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52">
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

            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="h-screen w-screen max-w-[100vw] bg-popover md:h-2/3 md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <SettingsComponent />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;
