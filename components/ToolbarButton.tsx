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
        className="rounded-full p-1 focus:outline-none hover:bg-stone-300"
      >
        {icon({ className: "h-6 w-6" })}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;
