/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Ref } from "react";

interface ItemsContainerProps {
  children: React.ReactNode;
  containerProps: Ref<HTMLUListElement>;
  depth: number;
}

const ItemsContainer: React.FC<ItemsContainerProps> = (props) => {
  const { children, containerProps } = props;

  return <ul {...containerProps}>{children}</ul>;
};

export default ItemsContainer;
