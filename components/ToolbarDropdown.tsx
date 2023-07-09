import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import * as RadixToast from "@radix-ui/react-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  MdStarOutline,
  MdDeleteOutline,
  MdStar,
  MdHistory,
  MdOutlineFileUpload,
  MdOutlineFileDownload,
} from "react-icons/md";

import {
  usePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/queryHooks";

import MenuButton from "@/components/MenuButton";
import { useState } from "react";
import Toast from "./Toast";

type ToolbarDropdownProps = {
  children: React.ReactNode;
};

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const [showUndoToast, setShowUndoToast] = useState(false);

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

  const undoDeletePageMutation = useUndoDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  return (
    <>
      <RadixDropdown.Root>
        <RadixDropdown.Trigger asChild>{props.children}</RadixDropdown.Trigger>

        <RadixDropdown.Portal>
          {!pageQuery.isError && pageQuery.data && (
            <RadixDropdown.Content
              align="end"
              alignOffset={5}
              side="bottom"
              sideOffset={5}
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
                <MenuButton text="Page History" onClick={() => {}}>
                  <MdHistory className="h-4 w-4" />
                </MenuButton>
              </RadixDropdown.Item>

              {/* <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

              <RadixDropdown.Item asChild>
                <MenuButton text="Import" onClick={() => {}}>
                  <MdOutlineFileUpload className="h-4 w-4" />
                </MenuButton>
              </RadixDropdown.Item>

              <RadixDropdown.Item asChild>
                <MenuButton text="Export" onClick={() => {}}>
                  <MdOutlineFileDownload className="h-4 w-4" />
                </MenuButton>
              </RadixDropdown.Item> */}

              <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

              <RadixDropdown.Item asChild>
                <MenuButton
                  text="Delete Page"
                  onClick={() => {
                    deletePageMutation.mutate();
                    setShowUndoToast(true);
                  }}
                >
                  <MdDeleteOutline className="h-4 w-4" />
                </MenuButton>
              </RadixDropdown.Item>
            </RadixDropdown.Content>
          )}
        </RadixDropdown.Portal>
      </RadixDropdown.Root>

      {/* Undo Delete Page Toast */}
      <Toast
        hasAction
        open={showUndoToast}
        onOpenChange={setShowUndoToast}
        actionText="Undo"
        title="Page moved to trash"
        actionOnClick={() => {
          undoDeletePageMutation.mutate();
          setShowUndoToast(false);
        }}
      />
    </>
  );
}
