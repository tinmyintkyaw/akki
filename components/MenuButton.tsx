import { forwardRef } from "react";
import { IconType } from "react-icons";

import { roboto, inter } from "@/pages/_app";

type MenuButtonProps = {
  icon: IconType;
  text: string;
  onClick: () => void;
};

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  (props, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`${inter.className} group my-[0.125rem] flex h-7 w-full items-center gap-2 rounded-sm px-2 text-sm text-stone-700 focus:bg-stone-200 focus:outline-none hover:bg-stone-200`}
      >
        {props.icon && <props.icon className="h-4 w-4" />}
        <p className="flex-grow text-start line-clamp-1">{props.text}</p>
      </button>
    );
  }
);

MenuButton.displayName = "MenuButton";

export default MenuButton;
