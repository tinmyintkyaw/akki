import { Button } from "#src/components/ui/button.tsx";
import { ScrollArea } from "#src/components/ui/scroll-area.tsx";
import { PageListHeader } from "#src/core/components/PageListHeader.tsx";
import { pagesQueryOptions } from "#src/core/queries/pages-query.ts";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouteContext, useSearch } from "@tanstack/react-router";

export function PageList() {
  const { space } = useRouteContext({
    from: "/_authenticated/s/$spaceId",
  });

  const { p: pageFilter, t: tag } = useSearch({ strict: false });

  const isTrash = pageFilter === "trash";
  const isPinned = pageFilter === "pinned";
  const tags = tag ? [tag] : undefined;

  const { data: pages } = useQuery(
    pagesQueryOptions(space.id, isPinned, isTrash, tags),
  );

  return (
    <div className="flex flex-col">
      <PageListHeader />

      <ScrollArea className="flex-1 min-h-0 w-full flex flex-col p-2">
        {pages &&
          pages.map((page) => (
            <Button
              key={page.id}
              variant={"ghost"}
              size="lg"
              nativeButton={false}
              render={
                <Link
                  to="/s/$spaceId/p/$pageId"
                  params={{
                    spaceId: space.id,
                    pageId: page.id,
                  }}
                  search={(prev) => prev}
                  preload={false}
                  activeProps={{ className: "bg-muted" }}
                />
              }
              className={"w-full justify-start"}
            >
              {page.name}
            </Button>
          ))}
      </ScrollArea>
    </div>
  );
}
