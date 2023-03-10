import { IconType } from "react-icons";

export default function SidebarMenuItem(props: {
  text: string;
  icon?: IconType;
}) {
  return (
    <a
      href="#"
      className="flex h-7 w-full items-center gap-2 bg-slate-50 px-4 text-sm hover:bg-slate-200"
    >
      {props.icon && <props.icon className="h-4 w-4" />}
      <p className="line-clamp-1">{props.text}</p>
    </a>
  );
}
