import { usePageQuery, useUpdatePageMutation } from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TitleEditor() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageQuery = usePageQuery(router.query.pageId as string);

  const [pageName, setPageName] = useState(pageQuery.data.pageName);

  const updatePageMutation = useUpdatePageMutation({
    id: pageQuery.data.id as string,
    pageName,
    queryClient,
  });

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
    <>
      {pageQuery.data && (
        // <h1
        //   contentEditable={true}
        //   onBlur={(e) => {
        //     e.currentTarget.innerText
        //       ? setPageName(e.currentTarget.innerText)
        //       : setPageName("Untitled");
        //   }}
        //   className="mb-6 mt-4 w-full text-4xl font-medium outline-none"
        // >
        //   {pageName === "Untitled" ? "" : pageName}
        // </h1>

        <textarea
          value={pageName !== "Untitled" ? pageName : ""}
          placeholder="Untitled"
          onChange={(event) => {
            if (event.target.value === "") return setPageName("Untitled");
            setPageName(event.target.value);
          }}
          className="mb-6 mt-4 box-border w-full text-4xl font-medium outline-none"
          style={{ wordWrap: "break-word", wordBreak: "break-word" }}
        />
      )}
    </>
  );
}
