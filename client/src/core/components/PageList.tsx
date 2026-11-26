import { ScrollArea } from "#src/components/ui/scroll-area.tsx";
import { PageListHeader } from "#src/core/components/PageListHeader.tsx";
import { PageListItem } from "#src/core/components/PageListItem.tsx";
import { pagesQueryOptions } from "#src/core/queries/pages-query.ts";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext, useSearch } from "@tanstack/react-router";

export function PageList() {
  const { space } = useRouteContext({
    from: "/_authenticated/s/$spaceId",
  });

  const { p: pageFilter, t: tag } = useSearch({ strict: false });

  const tags = tag ? [tag] : undefined;
  const view = tag ? "tags" : pageFilter;
  const { data: pages } = useQuery(pagesQueryOptions(space.id, view, tags));

  return (
    <div className="flex flex-col">
      <PageListHeader />

      <ScrollArea className="flex-1 min-h-0 w-full flex flex-col items-center justify-center">
        {pages &&
          pages.map((page) => (
            <PageListItem key={`page list ${page.id}`} page={page} />
          ))}

        {!pages ||
          (pages.length === 0 && (
            <div className="p-4 mx-auto text-center text-muted-foreground">
              <p>No pages to show</p>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}
