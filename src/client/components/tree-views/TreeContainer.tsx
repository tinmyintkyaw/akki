import React, { HTMLProps } from "react";

interface TreeContainerProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerProps: HTMLProps<any>;
}
const TreeContainer: React.FC<TreeContainerProps> = (props) => {
  const { children, containerProps } = props;
  return <div {...containerProps}>{children}</div>;
};

export default TreeContainer;
