import {
  useCreatePageMutation,
  useDeletePageMutation,
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { HiPlus } from "react-icons/hi2";

export default function SidebarMenuLink(props: {
  pageId: string;
  parentPageId: string | null;
  text: string;
  icon: IconType;
}) {
  const queryClient = useQueryClient();

  const createPageMutation = useCreatePageMutation(
    "Untitled Page",
    props.parentPageId,
    queryClient
  );

  const deletePageMutation = useDeletePageMutation(props.pageId, queryClient);

  return (
    <div className="group flex h-8 items-center gap-2 rounded-sm hover:bg-stone-200">
      <Link
        href={`/page/${props.pageId}`}
        className="flex flex-grow items-center p-2"
      >
        {props.icon && <props.icon className="h-4 w-4" />}
        <p className="flex-grow line-clamp-1">{props.text}</p>
      </Link>
      <button
        onClick={() => {
          // deletePageMutation.mutate();
          // if (router.query.pageId !== props.pageId) return;
          // // TODO: redirect to the last opened page
          // router.push(`/page/clf3bqw8c0001xd53wk865adb`);
        }}
        className="rounded-sm p-[2px] opacity-0 hover:bg-stone-300 group-hover:opacity-100"
      >
        <HiPlus className="h-4 w-4" />
      </button>
    </div>
  );
}
