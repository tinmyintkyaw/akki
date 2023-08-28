import React from "react";

interface ItemTitleProps {
  title: string;
}
const ItemTitle: React.FC<ItemTitleProps> = ({title}) => (
    <span
        className="line-clamp-1 flex-grow text-start align-middle text-sm font-medium leading-4 text-secondary-foreground">
    {title}
  </span>
);

export default ItemTitle