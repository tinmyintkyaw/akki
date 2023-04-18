import { forwardRef, PropsWithChildren } from "react";

import { roboto, inter } from "@/pages/_app";

type MenuButtonProps = {
  text: string;
  onClick?: () => void;
};

const MenuButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<MenuButtonProps>
>((props, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={`${inter.className} group my-[0.125rem] flex h-7 w-full items-center gap-2 rounded-sm px-2 text-sm text-stone-700 focus:bg-stone-200 focus:outline-none hover:bg-stone-200`}
    >
      <div className="h-4 w-4">{props.children}</div>
      <p className="flex-grow text-start line-clamp-1">{props.text}</p>
    </button>
  );
});

MenuButton.displayName = "MenuButton";

export default MenuButton;
