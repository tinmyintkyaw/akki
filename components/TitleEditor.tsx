import { usePageQuery, useUpdatePageMutation } from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TitleEditor() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageQuery = usePageQuery(router.query.pageId as string);

  const [pageName, setPageName] = useState(pageQuery.data.pageName);

  const updatePageMutation = useUpdatePageMutation(
    pageQuery.data.id as string,
    pageName,
    pageQuery.data.parentPageId,
    queryClient
  );

  useEffect(() => {
    if (pageName === pageQuery.data.pageName) return;

    const timeout = setTimeout(() => {
      updatePageMutation.mutate();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [pageName, pageQuery.data.pageName, updatePageMutation]);

  return (
    <div>
      {pageQuery.data && (
        <input
          value={pageName !== "Untitled" ? pageName : ""}
          placeholder="Untitled"
          onChange={(event) => {
            if (event.target.value === "") return setPageName("Untitled");
            setPageName(event.target.value);
          }}
          className="not-prose mb-6 mt-4 text-4xl font-medium outline-none"
        />
      )}
    </div>
  );
}
