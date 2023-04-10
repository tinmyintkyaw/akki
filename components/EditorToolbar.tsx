import { usePageQuery } from "@/hooks/queryHooks";
import { useRouter } from "next/router";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

import {
  RxMagnifyingGlass,
  RxDotsHorizontal,
  RxHamburgerMenu,
} from "react-icons/rx";

import ToolbarButton from "@/components/ToolbarButton";
import ToolbarDropdown from "@/components/ToolbarDropdown";
import MenuButton from "@/components/MenuButton";
import SearchComboBox from "./SearchComboBox";
import { KeyboardEvent, useEffect, useState } from "react";

type EditorToolbarProps = {
  setIsOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: any) {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  return (
    <div
      id="editor-toolbar"
      className="absolute z-40 flex h-12 w-full select-none items-center gap-1 bg-transparent px-2 text-stone-700"
    >
      <ToolbarButton icon={RxHamburgerMenu} onClick={props.setIsOpen} />

      <ToolbarButton
        icon={RxMagnifyingGlass}
        onClick={() => {
          setIsSearchOpen(true);
        }}
      />
      <SearchComboBox isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />

      <div className="flex-grow" />

      <ToolbarDropdown trigger={<ToolbarButton icon={RxDotsHorizontal} />} />
    </div>
  );
}
