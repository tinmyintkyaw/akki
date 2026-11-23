import { Button, buttonVariants } from "#src/components/ui/button.tsx";
import { ScrollArea } from "#src/components/ui/scroll-area.tsx";
import { SidebarHeader } from "#src/core/components/SidebarHeader.tsx";
import { tagsQueryOptions } from "#src/core/queries/tags-query.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Link,
  useRouteContext,
  type LinkOptions,
} from "@tanstack/react-router";
import { FileText, Hash, type LucideIcon } from "lucide-react";

type NavLink = {
  label: string;
  icon: LucideIcon;
  options: LinkOptions;
};

const navLinks: NavLink[] = [
  {
    options: {
      to: "/s/$spaceId",
      activeOptions: { exact: true },
    },
    label: "Pages",
    icon: FileText,
  },
];

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
                {...link.options}
                params={{ pageId: space.id }}
                activeProps={{
                  className: buttonVariants({ variant: "default" }),
                }}
              >
                {<link.icon />}
                <span>{link.label}</span>
              </Link>
            }
          />
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
          >
            <Hash />
            {tag.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
