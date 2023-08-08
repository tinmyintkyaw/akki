import clsx from "clsx";
import { TreeItemRenderContext } from "react-complex-tree";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Check, ChevronDown } from "lucide-react";

import React, {
  FormHTMLAttributes,
  HTMLProps,
  InputHTMLAttributes,
  Ref,
} from "react";

interface ItemTitleProps {
  title: string;
}
export const ItemTitle: React.FC<ItemTitleProps> = ({ title }) => (
  <span className="line-clamp-1 flex-grow text-start">{title}</span>
);

interface ItemArrowProps {
  context: TreeItemRenderContext;
}
export const ItemArrow: React.FC<ItemArrowProps> = ({ context }) => (
  <div
    {...context.arrowProps}
    className="flex h-8 items-center justify-center rounded pl-2"
  >
    <ChevronDown
      className={clsx(
        "h-4 w-4 transition-transform duration-300",
        context.isExpanded && "rotate-180"
      )}
    />
  </div>
);

interface TreeContainerProps {
  children: React.ReactNode;
  containerProps: HTMLProps<any>;
}
export const TreeContainer: React.FC<TreeContainerProps> = (props) => {
  const { children, containerProps } = props;
  return <div {...containerProps}>{children}</div>;
};

interface ItemsContainerProps {
  children: React.ReactNode;
  containerProps: HTMLProps<any>;
  depth: number;
}
export const ItemsContainer: React.FC<ItemsContainerProps> = (props) => {
  const { children, containerProps, depth } = props;
  const [parent, enableAnimations] = useAutoAnimate();
  return (
    <ul
      {...containerProps}
      ref={parent}
      // className={clsx(depth === 0 ? "pl-0" : "pl-6")}
    >
      {children}
    </ul>
  );
};

interface RenameInputProps {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: Ref<HTMLInputElement>;
  submitButtonProps: HTMLProps<any>;
  submitButtonRef: Ref<any>;
  formProps: FormHTMLAttributes<HTMLFormElement>;
}
export const RenameInput: React.FC<RenameInputProps> = (props) => {
  const {
    formProps,
    inputProps,
    inputRef,
    submitButtonProps,
    submitButtonRef,
  } = props;

  return (
    <form {...formProps} className="flex flex-grow">
      <input
        {...inputProps}
        ref={inputRef}
        autoFocus
        className="flex-grow bg-inherit outline-none"
      />

      <button
        {...submitButtonProps}
        ref={submitButtonRef}
        type="submit"
        className="h-8 w-8 rounded p-2 hover:bg-neutral-700"
      >
        <Check className="h-4 w-4" />
      </button>
    </form>
  );
};
