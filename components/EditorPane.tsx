import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ReactNode } from "react";

type EditorPaneProps = {
  editorComponent: ReactNode;
};

export default function EditorPane(props: EditorPaneProps) {
  return (
    <div id="editor-pane" className="flex-grow pt-12">
      <ScrollArea.Root type="auto">
        <ScrollArea.Viewport className="h-[calc(100vh-3rem)] w-full bg-slate-50 outline-none">
          {props.editorComponent}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical" className="select-none">
          <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-400 hover:bg-stone-500" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
