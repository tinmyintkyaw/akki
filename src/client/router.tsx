import AppLayout from "@/AppLayout";
import Index from "@/Index";
import GlobalError from "@/components/GlobalError";
import RightPane from "@/components/RightPane";
import Signin from "@/components/Signin";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Loaders
// const signinLoader: LoaderFunction = async () => {
//   try {
//     await queryClient.fetchQuery({
//       queryKey: ["session"],
//       queryFn: sessionQueryFn,
//     });
//     return redirect("/");
//   } catch (error) {
//     return null;
//   }
// };

// const indexLoader: LoaderFunction = async () => {
//   try {
//     const recentPageList = await queryClient.fetchQuery({
//       queryKey: ["recentPages"],
//       queryFn: getRecentPageList,
//     });

//     if (recentPageList.length === 0) return null;
//     return redirect(`/${recentPageList[0].id}`);
//   } catch (error) {
//     return redirect("/signin");
//   }
// };

// const pageLoader: LoaderFunction = async ({ params }) => {
//   try {
//     await queryClient.fetchQuery({
//       queryKey: ["page", params.pageId ?? ""],
//       queryFn: () => getPageById(params.pageId ?? ""),
//     });
//     return null;
//   } catch (error) {
//     if (error instanceof HTTPError && error.status === 401)
//       return redirect("/signin");

//     throw error;
//   }
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<GlobalError />}>
      <Route path="/signin" element={<Signin />} />

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Index />} />
        <Route path="/:pageId" element={<RightPane />} />
      </Route>
    </Route>,
  ),
);

export default router;
