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
      className={`${inter.className} group my-[0.125rem] flex h-7 w-full items-center gap-2 rounded-sm px-2 text-sm text-popover-foreground focus:bg-accent focus:outline-none hover:bg-accent`}
    >
      <div className="h-4 w-4">{props.children}</div>
      <p className="line-clamp-1 flex-grow text-start">{props.text}</p>
    </button>
  );
});

MenuButton.displayName = "MenuButton";

export default MenuButton;
