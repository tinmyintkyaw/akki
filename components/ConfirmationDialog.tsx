import * as RadixDialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";

interface ConfirmationDialogProps {
  children: ReactNode;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDialog.Trigger asChild>{props.children}</RadixDialog.Trigger>

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/80">
          <RadixDialog.Content className="fixed left-[50%] top-[30%] z-50 w-[95vw] max-w-md -translate-x-[50%] -translate-y-[50%] rounded bg-gray-100 p-4 focus:outline-none md:w-full md:max-w-2xl">
            {/* ...Dialog Content */}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
