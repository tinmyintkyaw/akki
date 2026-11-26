import {
  useHocuspocusEvent,
  useHocuspocusProvider,
} from "@hocuspocus/provider-react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Tiptap, TiptapContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import "#src/editor/editor.css";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Editor() {
  const { data: session } = useSuspenseQuery(sessionQueryOptions());

  const provider = useHocuspocusProvider();

  const [authFailed, setAuthFailed] = useState(true);

  useHocuspocusEvent("authenticationFailed", () => {
    setAuthFailed(true);
  });

  useHocuspocusEvent("authenticated", () => {
    setAuthFailed(false);
  });

  const editor = useEditor({
    autofocus: "start",
    extensions: [
      // TODO: add title block
      // TODO: setup schema for core functionalities
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: provider.document }),
      CollaborationCaret.configure({
        provider,
        // TODO: set name from session
        // TODO: set random color
        user: { name: session ? session.user.name : "" },
      }),
    ],
  });

  if (!editor) return null;

  if (authFailed) return null;

  return (
    <Tiptap editor={editor}>
      <TiptapContent />
    </Tiptap>
  );
}
