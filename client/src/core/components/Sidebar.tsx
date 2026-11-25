import { Button, buttonVariants } from "#src/components/ui/button.tsx";
import { ScrollArea } from "#src/components/ui/scroll-area.tsx";
import { navLinks } from "#src/core/components/nav-links.ts";
import { SidebarHeader } from "#src/core/components/SidebarHeader.tsx";
import { tagsQueryOptions } from "#src/core/queries/tags-query.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Hash } from "lucide-react";

export function Sidebar() {
  const { space } = useRouteContext({
    from: "/_authenticated/s/$spaceId",
  });

  const { data: tags } = useSuspenseQuery(tagsQueryOptions(space.id));

  return (
    <div className="flex flex-col w-full h-full">
      <nav className="shrink-0 p-2 w-full">
        <SidebarHeader />

        {navLinks.map((link) => (
          <Button
            key={link.label}
            variant={"ghost"}
            size={"lg"}
            className={"w-full justify-start"}
            nativeButton={false}
            render={
              <Link
                search={link.search}
                activeOptions={{ includeSearch: true }}
                activeProps={{ className: "bg-muted" }}
              />
            }
          >
            {<link.icon />}
            <span>{link.label}</span>
          </Button>
        ))}
      </nav>

      <div className="text-xs shrink-0 px-4 pt-2">Tags</div>

      <ScrollArea className="flex-1 min-h-0 w-full flex flex-col p-2">
        {tags.map((tag) => (
          <Button
            key={tag.id}
            variant={"ghost"}
            size={"lg"}
            className={"justify-start w-full"}
            nativeButton={false}
            render={
              <Link
                from="/s/$spaceId/p/$pageId"
                params={(prev) => prev}
                search={(prev) => {
                  if ("p" in prev) {
                    const { p: _, ...rest } = prev;
                    return { ...rest, t: tag.id };
                  }

                  return { ...prev, t: tag.id };
                }}
                activeProps={{ className: "bg-muted" }}
              />
            }
          >
            <Hash />
            {tag.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
