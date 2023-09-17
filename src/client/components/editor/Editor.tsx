import SelectMenu from "@/components/editor/SelectMenu";
import useContentEditor from "@/hooks/editor/useContentEditor";
import useTitleEditor from "@/hooks/editor/useTitleEditor";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { useParams } from "react-router-dom";

import "@/assets/intellij-light.css";

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
            "mx-auto h-full w-full bg-background px-8 pb-4 pt-12 text-4xl font-bold text-foreground",
            "max-w-3xl",
          )}
        />
      )}

      {contentEditor && (
        <EditorContent
          className={clsx(
            "prose prose-slate mx-auto h-full w-full bg-background px-8 pb-6 dark:prose-invert",
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
