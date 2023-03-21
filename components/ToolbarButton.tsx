import { forwardRef } from "react";
import { IconType } from "react-icons/lib";

type ToolbarButtonProps = {
  icon: IconType;
  onClick?: () => void;
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon, ...rest }, ref) => {
    return (
      <button
        {...rest}
        onClick={rest.onClick}
        ref={ref}
        className="rounded p-1 hover:bg-stone-300 focus:outline-none"
      >
        {icon({ className: "h-5 w-5 stroke-[0.25]" })}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
