import { PropsWithChildren, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

export default function BlockWrapper(props: PropsWithChildren) {
  const [showhandle, setShowHandle] = useState(false);

  return (
    <div
      onMouseOver={(event) => {
        event.stopPropagation();
        setShowHandle(true);
      }}
      onMouseLeave={() => setShowHandle(false)}
      className={`relative flex before:absolute before:bottom-0 before:right-full before:top-0 before:w-full`}
    >
      {showhandle && (
        <button
          contentEditable={false}
          data-drag-handle
          className={`absolute -left-6 my-1 cursor-grab rounded text-slate-500 hover:bg-slate-200`}
        >
          <MdDragIndicator className="h-7 w-5" />
        </button>
      )}

      {props.children}
    </div>
  );
}
