import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { FC } from "react";

const PageNotFound: FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-center">
      <h1 className="mb-4 text-lg font-medium">Page Not Found</h1>

      <Button
        variant={"outline"}
        size={"default"}
        onClick={() => router.push("/")}
      >
        <span>Back to my content</span>
      </Button>
    </div>
  );
};
export default PageNotFound;
