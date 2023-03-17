import { IconType } from "react-icons/lib";
import { MdMenu } from "react-icons/md";

type ToolbarButtonProps = {
  icon: IconType;
  onClick: () => void;
};

export default function ToolbarButton(props: ToolbarButtonProps) {
  return (
    <button onClick={props.onClick} className="rounded p-1 hover:bg-stone-300">
      {props.icon && <props.icon className="h-5 w-5 stroke-[0.25]" />}
    </button>
  );
}
