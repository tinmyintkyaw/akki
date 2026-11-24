import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback } from "#src/components/ui/avatar.tsx";
import {
  Check,
  ChevronDown,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Plus,
  Settings as SettingsIcon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Button } from "#src/components/ui/button.tsx";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { queryClient } from "#src/lib/query.ts";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { authClient } from "#src/lib/auth.ts";
import { useTheme, type Theme } from "#src/components/theme-provider.tsx";
import { useState } from "react";
import { Settings } from "#src/core/components/Settings.tsx";

export function SidebarHeader() {
  const {
    session,
    spaces,
    space: currSpace,
  } = useRouteContext({
    from: "/_authenticated/s/$spaceId",
  });

  const navigate = useNavigate();

  const signOut = async () => {
    await queryClient.cancelQueries();
    await authClient.signOut();
    queryClient.setQueryData(sessionQueryOptions().queryKey, null);
    await navigate({ to: "/sign-in", replace: true });
    queryClient.clear();
  };

  const { theme: currTheme, setTheme } = useTheme();

  const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
    {
      value: "system",
      label: "System",
      icon: Monitor,
    },
    {
      value: "light",
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
    },
  ];

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-10 justify-start w-full mb-4"
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback>
              {session.user.name.at(0)?.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="">{currSpace.name}</span>

          <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Spaces</DropdownMenuLabel>

            {spaces.map((space) => (
              <DropdownMenuItem
                key={space.id}
                onClick={() =>
                  navigate({
                    to: "/s/$spaceId",
                    params: { spaceId: space.id },
                    search: { p: "all" },
                  })
                }
              >
                <Avatar size="sm">
                  <AvatarFallback>
                    {space.name.at(0)?.toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span>{space.name}</span>

                {space.id === currSpace.id && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}

            {/* TODO: Create new space dialog */}
            <DropdownMenuItem>
              <Plus className="size-6 p-1" />
              <span>New Space</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette />
                <span>Theme</span>
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent className={"w-40"}>
                  {THEME_OPTIONS.map((theme) => (
                    <DropdownMenuItem
                      key={theme.value}
                      onClick={() => setTheme(theme.value)}
                    >
                      <theme.icon />
                      <span>{theme.label}</span>
                      {theme.value === currTheme && (
                        <Check className="ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={() => setSettingsOpen((prev) => !prev)}>
              <SettingsIcon />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" onClick={signOut}>
              <LogOut />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
