import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import MenuButton from "@/components/MenuButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  MdLogout,
  MdStarOutline,
  MdDeleteOutline,
  MdStar,
} from "react-icons/md";

import {
  useDeletePageMutation,
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/queryHooks";

type ToolbarDropdownProps = {
  trigger: React.ReactNode;
};

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const toggleFavouriteMutation = useUpdatePageMutation({
    id: pageQuery.data?.id as string,
    isFavourite: !pageQuery.data?.isFavourite as boolean,
    queryClient,
  });

  const deletePageMutation = useDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{props.trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        {!pageQuery.isError && pageQuery.data && (
          <RadixDropdown.Content
            align="end"
            alignOffset={10}
            className="flex w-60 flex-col rounded border border-stone-200 bg-stone-50 p-1 shadow-md"
          >
            <RadixDropdown.Item asChild>
              <MenuButton
                text={
                  pageQuery.data.isFavourite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
                onClick={() => toggleFavouriteMutation.mutate()}
              >
                {pageQuery.data.isFavourite ? (
                  <MdStarOutline className="h-4 w-4" />
                ) : (
                  <MdStar className="h-4 w-4" />
                )}
              </MenuButton>
            </RadixDropdown.Item>

            <RadixDropdown.Item asChild>
              <MenuButton
                text="Delete Page"
                onClick={() => {
                  deletePageMutation.mutate();
                  // TODO: redirect to previous page on success
                  // deletePageMutation.isSuccess &&
                  //   router.push("/page/clf3bqw8c0001xd53wk865adb");
                }}
              >
                <MdDeleteOutline className="h-4 w-4" />
              </MenuButton>
            </RadixDropdown.Item>

            <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

            <RadixDropdown.Item asChild>
              <MenuButton text="Logout" onClick={() => signOut()}>
                <MdLogout className="h-4 w-4" />
              </MenuButton>
            </RadixDropdown.Item>
          </RadixDropdown.Content>
        )}
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
