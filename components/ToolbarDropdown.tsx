import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { LogOut, Settings, Star, StarOff, SunMoon, Trash2 } from "lucide-react";

import {
  usePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import SettingsComponent from "./Settings";

interface ToolbarDropdownProps {
  children: React.ReactNode;
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = (props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const toggleFavouriteMutation = useUpdatePageMutation(queryClient);
  const deletePageMutation = useDeletePageMutation(queryClient);
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          {pageQuery.data && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  toggleFavouriteMutation.mutate({
                    id: router.query.pageId as string,
                    isFavourite: !pageQuery.data.isFavourite,
                  })
                }
              >
                {pageQuery.data?.isFavourite ? (
                  <StarOff className="mr-2 h-4 w-4" />
                ) : (
                  <Star className="mr-2 h-4 w-4" />
                )}

                <span className="leading-4">
                  {pageQuery.data?.isFavourite
                    ? "Remove from favourites"
                    : "Add to favourites"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  deletePageMutation.mutate({
                    id: router.query.pageId as string,
                  });
                  toast({
                    title: "Page Moved to Trash",
                    action: (
                      <ToastAction
                        onClick={() =>
                          undoDeletePageMutation.mutate({
                            id: router.query.pageId as string,
                          })
                        }
                        altText="Undo"
                      >
                        Undo
                      </ToastAction>
                    ),
                  });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="leading-4">Delete Page</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoon className="mr-2 h-4 w-4" />
              <span className="leading-4">Change Theme</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <span className="leading-4">Light</span>
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="dark">
                  <span className="leading-4">Dark</span>
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="system">
                  <span className="leading-4">System</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span className="leading-4">Settings</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="leading-4">Sign Out</span>
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
  );
};

export default ToolbarDropdown;
