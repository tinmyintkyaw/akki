import AppLayout from "@/AppLayout";
import Index from "@/Index";
import RightPane from "@/components/RightPane";
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

      <Route element={<AppLayout />}>
        <Route index element={<Index />} />
        <Route
          path="/:pageId"
          element={<RightPane />}
          errorElement={<p>Error</p>}
        />
      </Route>
    </Route>,
  ),
);

export default router;
