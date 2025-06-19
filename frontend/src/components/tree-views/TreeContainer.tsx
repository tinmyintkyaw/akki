import React from "react";

interface TreeContainerProps {
  children: React.ReactNode;
  containerProps: React.Ref<HTMLDivElement>;
}
const TreeContainer: React.FC<TreeContainerProps> = (props) => {
  const { children, containerProps } = props;
  return <div {...containerProps}>{children}</div>;
};

export default TreeContainer;
