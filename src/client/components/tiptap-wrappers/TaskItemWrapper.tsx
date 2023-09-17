import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { useState } from "react";

export default function TaskItemWrapper(props: NodeViewProps) {
  const [isChecked, setIsChecked] = useState(props.node.attrs.checked);

  return (
    <NodeViewWrapper>
      <label contentEditable={false} className="absolute -left-0 select-none">
        <input
          type={"checkbox"}
          checked={isChecked}
          onChange={() => {
            props.updateAttributes({
              checked: !isChecked,
            });
            setIsChecked(!isChecked);
          }}
          className="h-7 w-4"
        />
      </label>

      <NodeViewContent as={"div"} className="not-prose w-full" />
    </NodeViewWrapper>
  );
}
