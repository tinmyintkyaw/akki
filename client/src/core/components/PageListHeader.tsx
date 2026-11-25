import { Button } from "#src/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import { navLinks } from "#src/core/components/nav-links.ts";
import { createPageMutationOptions } from "#src/core/queries/create-page-mutation.ts";
import { tagsQueryOptions } from "#src/core/queries/tags-query.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { ChevronDown, Plus, Search } from "lucide-react";

export function PageListHeader() {
  const search = useSearch({ strict: false });

  const activeNav = navLinks.find((link) => {
    if (typeof link.search === "object" && link.search !== null) {
      return link.search.p === search.p;
    }
    return false;
  });

  const { spaceId } = useParams({ from: "/_authenticated/s/$spaceId" });
  const createPageMutation = useMutation(createPageMutationOptions(spaceId));

  const { data: tags } = useQuery(tagsQueryOptions(spaceId));

  const activeTag = tags && search.t && tags.find((tag) => tag.id === search.t);

  return (
    <div className="shrink-0 flex items-center justify-center px-2 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="lg" />}>
          {activeNav && activeNav.label}
          {activeTag && activeTag.name}
          <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {navLinks.map((link) => (
              <DropdownMenuItem
                key={link.label}
                nativeButton={false}
                render={
                  <Link
                    params={(prev) => prev}
                    search={link.search}
                    activeOptions={{ includeSearch: true }}
                  />
                }
              >
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size={"icon-lg"}
        onClick={() => createPageMutation.mutate()}
        className="ml-auto"
      >
        <Plus />
      </Button>

      <Button variant="ghost" size={"icon-lg"}>
        <Search />
      </Button>
    </div>
  );
}
