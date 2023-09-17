import SettingsComponent from "@/components/Settings";
import { useTheme } from "@/components/theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeletePageMutation,
  usePageQuery,
  useUndoDeletePageMutation,
  useUpdatePageMutation,
} from "@/hooks/pageQueryHooks";
import { ToastAction } from "@radix-ui/react-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  Moon,
  Settings,
  Star,
  StarOff,
  SunMedium,
  SunMoon,
  Trash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Theme } from "@/components/theme-provider";

interface ToolbarDropdownProps {
  children: React.ReactNode;
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = (props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const toggleStarredMutation = useUpdatePageMutation(queryClient);
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
                  toggleStarredMutation.mutate({
                    id: params.pageId ?? "",
                    isStarred: !pageQuery.data.isStarred,
                  })
                }
              >
                {pageQuery.data && pageQuery.data.isStarred ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    <span>Remove from favourites</span>
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Add to favourites</span>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  deletePageMutation.mutate({
                    id: params.pageId ?? "",
                  });
                  toast({
                    title: "Page Moved to Trash",
                    action: (
                      <ToastAction
                        onClick={() =>
                          undoDeletePageMutation.mutate({
                            id: params.pageId ?? "",
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
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Page</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === "light" && <SunMedium className="mr-2 h-4 w-4" />}
              {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
              {theme === "system" && <SunMoon className="mr-2 h-4 w-4" />}

              <span>Change Theme</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  function isTheme(theme: string): theme is Theme {
                    return (theme as Theme) !== undefined;
                  }
                  if (isTheme(value)) setTheme(value);
                }}
              >
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

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={async () => {
              await fetch("/api/signout", { method: "POST" });
              navigate("/signin");
            }}
          >
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
  );
};

export default ToolbarDropdown;
