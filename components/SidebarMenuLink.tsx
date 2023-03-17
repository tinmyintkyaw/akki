import Link from "next/link";
import { IconType } from "react-icons";
import { HiPlus } from "react-icons/hi2";

export default function SidebarMenuLink(props: {
  text: string;
  icon?: IconType;
  href: string;
  addPageCallback?: () => void;
}) {
  return (
    <Link
      href={props.href}
      className="group flex h-8 items-center gap-2 rounded-sm p-2 hover:bg-stone-200"
    >
      {props.icon && <props.icon className="h-4 w-4" />}

      <p className="flex-grow line-clamp-1">{props.text}</p>

      <button
        onClick={props.addPageCallback}
        className="rounded-sm p-[2px] opacity-0 hover:bg-stone-300 group-hover:opacity-100"
      >
        <HiPlus className="h-4 w-4" />
      </button>
    </Link>
  );
}
