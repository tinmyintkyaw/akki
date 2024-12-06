import AppLayout from "@/components/AppLayout";
import EditorLayout from "@/components/EditorLayout";
import IndexPage from "@/components/IndexPage";
// import GlobalError from "@/components/error/GlobalError";
import Protected from "@/components/Protected";
import Signin from "@/components/Signin";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/signin" element={<Signin />} />

      <Route
        path="/"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<IndexPage />} />
        <Route path="/:pageId" element={<EditorLayout />} />
      </Route>
    </Route>,
  ),
);

export default router;
