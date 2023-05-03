import clsx from "clsx";
import { PropsWithChildren, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

type BlockWrapperProps = {
  blockType?: "blockquote" | "h1" | "h2" | "h3";
};

export default function BlockWrapper(
  props: PropsWithChildren<BlockWrapperProps>
) {
  const [showHandle, setShowHandle] = useState(false);

  return (
    <div
      onMouseOver={(event) => {
        event.stopPropagation();
        setShowHandle(true);
      }}
      onMouseLeave={() => setShowHandle(false)}
      className={`relative flex before:absolute before:bottom-0 before:right-full before:top-0 before:w-full`}
    >
      {showHandle && (
        <button
          contentEditable={false}
          data-drag-handle
          className={clsx(
            "absolute -left-6 cursor-grab rounded text-slate-500 hover:bg-slate-200",
            !props.blockType && "mt-1",
            props.blockType === "blockquote" && "mt-2",
            props.blockType === "h1" && "mt-[28px]",
            props.blockType === "h2" && "mt-[26px]",
            props.blockType === "h3" && "mt-[24px]"
          )}
        >
          <MdDragIndicator className="h-7 w-5" />
        </button>
      )}

      {props.children}
    </div>
  );
}
