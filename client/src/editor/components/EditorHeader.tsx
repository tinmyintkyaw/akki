import { pageQueryOptions } from "#src/core/queries/page-query.ts";
import { EditorHeaderMenu } from "#src/editor/components/EditorHeaderMenu.tsx";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export function EditorHeader() {
  const { spaceId, pageId } = useParams({ strict: false });

  const { data: page } = useQuery(pageQueryOptions(spaceId, pageId));

  return (
    <header className="flex shrink-0 p-2 items-center select-none">
      <h1 className="px-2 truncate max-w-1/2">{page && page.name}</h1>

      {page && <EditorHeaderMenu page={page} />}
    </header>
  );
}
