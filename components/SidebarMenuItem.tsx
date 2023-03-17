import Link from "next/link";
import { IconType } from "react-icons";
import { HiPlus } from "react-icons/hi2";

export function SidebarMenuButton(props: {
  text: string;
  icon?: IconType;
  onclick: () => void;
}) {
  return (
    <>
      <button className="mx-2 flex h-8 w-[100%-1rem] items-center gap-2 px-2 hover:bg-stone-300">
        {props.icon && <props.icon className="h-4 w-4" />}
        <p className="line-clamp-1">{props.text}</p>
      </button>
    </>
  );
}

export function SidebarMenuLink(props: {
  text: string;
  icon?: IconType;
  href: string;
  addPageCallback?: () => void;
}) {
  return (
    <Link
      href={props.href}
      className="group flex h-7 items-center gap-2 rounded-sm pl-2 pr-1 hover:bg-stone-300"
    >
      {props.icon && <props.icon className="h-4 w-4" />}

      <p className="flex-grow line-clamp-1">{props.text}</p>

      <button
        onClick={props.addPageCallback}
        className="rounded-sm p-[2px] opacity-0 hover:bg-stone-400 group-hover:opacity-100"
      >
        <HiPlus className="h-4 w-4" />
      </button>
    </Link>
  );
}
