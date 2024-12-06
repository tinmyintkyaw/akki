import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React from "react";
import { TreeItemRenderContext } from "react-complex-tree";

interface ItemArrowProps {
  context: TreeItemRenderContext;
}

const ItemArrow: React.FC<ItemArrowProps> = ({ context }) => {
  return (
    <div
      {...context.arrowProps}
      onClick={(e) => {
        e.stopPropagation();
        context.arrowProps.onClick && context.arrowProps.onClick(e);
      }}
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded"
    >
      <ChevronDown
        className={clsx(
          "h-4 w-4 text-accent-foreground transition-transform duration-300",
          context.isExpanded && "rotate-180",
        )}
      />
    </div>
  );
};

export default ItemArrow;
