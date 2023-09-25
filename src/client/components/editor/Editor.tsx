import SelectMenu from "@/components/editor/SelectMenu";
import useContentEditor from "@/hooks/editor/useContentEditor";
import useTitleEditor from "@/hooks/editor/useTitleEditor";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { useParams } from "react-router-dom";

import "@/styles/atom-one-light.css";
import "@/styles/atom-one-dark.css";

interface EditorProps {
  // ydoc: Y.Doc;
  provider: HocuspocusProvider;
}

const Editor = (props: EditorProps) => {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");

  const titleEditor = useTitleEditor();
  const contentEditor = useContentEditor(props.provider);

  return (
    <>
      {titleEditor && !pageQuery.isLoading && !pageQuery.isError && (
        <EditorContent
          editor={titleEditor}
          className={clsx(
            "prose mx-auto bg-background px-8 pt-12 text-foreground dark:prose-invert",
            "max-w-3xl",
          )}
        />
      )}

      {contentEditor && (
        <EditorContent
          className={clsx(
            "prose mx-auto bg-background px-8 pb-8 text-foreground dark:prose-invert",
            "max-w-3xl",
          )}
          editor={contentEditor}
          // Prevent Tab key from escaping editor
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
          }}
        >
          <SelectMenu editor={contentEditor} />
        </EditorContent>
      )}
    </>
  );
};
export default Editor;
