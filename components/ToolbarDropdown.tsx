import clsx from "clsx";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

import { sourceSans } from "@/pages/_app";
import MenuButton from "@/components/MenuButton";
import { RxFilePlus, RxStar, RxTrash } from "react-icons/rx";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePageMutation, usePageQuery } from "@/hooks/queryHooks";
import { useRouter } from "next/router";

type ToolbarDropdownProps = {
  trigger: React.ReactNode;
};

export default function ToolbarDropdown(props: ToolbarDropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deletePageMutation = useDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{props.trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="end"
          alignOffset={10}
          className={clsx(
            // sourceSans.className,
            "flex w-60 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          )}
        >
          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxStar}
              text="Add To Favourites"
              onClick={() => {}}
              key={"toggleFavourite"}
            />
          </RadixDropdown.Item>

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxTrash}
              text="Delete Page"
              onClick={() => {
                deletePageMutation.mutate();
                // TODO: redirect to previous page on success
                deletePageMutation.isSuccess &&
                  router.push("/page/clf3bqw8c0001xd53wk865adb");
              }}
              key={"deletePage"}
            />
          </RadixDropdown.Item>

          <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxFilePlus}
              text="Export Page"
              onClick={() => {}}
              key={"exportPage"}
            />
          </RadixDropdown.Item>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
