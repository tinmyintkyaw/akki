import {
  RxMagnifyingGlass,
  RxDotsHorizontal,
  RxHamburgerMenu,
} from "react-icons/rx";
import ToolbarButton from "./ToolbarButton";

type EditorToolbarProps = {
  setIsOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  return (
    <div
      id="editor-toolbar"
      className="absolute z-40 flex h-12 w-full select-none items-center gap-1 bg-transparent px-2 text-stone-700"
    >
      <ToolbarButton icon={RxHamburgerMenu} onClick={props.setIsOpen} />
      <ToolbarButton icon={RxMagnifyingGlass} onClick={() => {}} />
      <div className="flex-grow" />
      <ToolbarButton icon={RxDotsHorizontal} onClick={() => {}} />
    </div>
  );
}
