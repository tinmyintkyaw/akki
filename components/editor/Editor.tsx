import clsx from "clsx";
import { EditorContent } from "@tiptap/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useRouter } from "next/router";

import { usePageQuery } from "@/hooks/pageQueryHooks";
import useContentEditor from "@/hooks/editor/useContentEditor";
import useTitleEditor from "@/hooks/editor/useTitleEditor";

import SelectMenu from "@/components/editor/BubbleMenu";

import "highlight.js/styles/atom-one-light.css";

interface EditorProps {
  // ydoc: Y.Doc;
  provider: HocuspocusProvider;
}

const Editor = (props: EditorProps) => {
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const titleEditor = useTitleEditor();
  const contentEditor = useContentEditor(props.provider);

  return (
    <>
      {titleEditor && !pageQuery.isLoading && !pageQuery.isError && (
        <EditorContent
          editor={titleEditor}
          className={clsx(
            "mx-auto h-full w-full bg-background px-8 pb-8 pt-12 text-4xl font-bold text-foreground",
            "max-w-3xl"
          )}
        />
      )}

      {contentEditor && (
        <EditorContent
          className={clsx(
            "prose prose-gray mx-auto h-full w-full bg-background px-8 pb-6 dark:prose-invert",
            "max-w-3xl"
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
