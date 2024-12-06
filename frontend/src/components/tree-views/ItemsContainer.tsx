/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from "react";

interface ItemsContainerProps {
  children: React.ReactNode;
  containerProps: HTMLProps<any>;
  depth: number;
}

const ItemsContainer: React.FC<ItemsContainerProps> = (props) => {
  const { children, containerProps } = props;

  return <ul {...containerProps}>{children}</ul>;
};

export default ItemsContainer;
