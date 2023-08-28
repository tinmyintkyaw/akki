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
            "mx-auto h-full w-full break-words bg-background px-8 pb-6 pt-12 text-4xl font-semibold dark:prose-invert selection:bg-primary dark:selection:bg-[#315EC1]",
            "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
          )}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            contentEditor?.commands.focus("start");
          }}
        />
      )}

      {contentEditor && (
        <EditorContent
          spellCheck={false}
          className={clsx(
            "prose prose-neutral mx-auto h-full w-full break-words bg-background px-8 pb-6 text-base dark:prose-invert selection:bg-primary dark:selection:bg-[#315EC1]",
            "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
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
