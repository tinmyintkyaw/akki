import { IconType } from "react-icons";

export function SidebarMenuButton(props: {
  text: string;
  icon?: IconType;
  onclick: () => void;
}) {
  return (
    <>
      <button className="flex h-7 w-full items-center gap-2 bg-slate-50 px-4 text-sm hover:bg-slate-200">
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
}) {
  return (
    <a
      href={props.href}
      className="flex h-7 w-full items-center gap-2 bg-slate-50 px-4 text-sm hover:bg-slate-200"
    >
      {props.icon && <props.icon className="h-4 w-4" />}
      <p className="line-clamp-1">{props.text}</p>
    </a>
  );
}
