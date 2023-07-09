import * as RadixToast from "@radix-ui/react-toast";

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  hasAction?: boolean;
  actionText?: string;
  actionOnClick?: () => void;
}

const Toast = (props: ToastProps) => {
  return (
    <RadixToast.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      duration={3000}
      className="flex flex-row items-center gap-2 rounded-md border-2 bg-neutral-800 p-3 text-sm text-neutral-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <RadixToast.Title className="flex-grow">{props.title}</RadixToast.Title>

      {props.hasAction && props.actionText && props.actionOnClick && (
        <RadixToast.Action
          altText={props.actionText}
          onClick={props.actionOnClick}
          className="rounded bg-neutral-700 px-2 py-1 text-xs hover:bg-neutral-600"
        >
          {props.actionText}
        </RadixToast.Action>
      )}
    </RadixToast.Root>
  );
};

export default Toast;
