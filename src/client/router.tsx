import AppLayout from "@/AppLayout";
import Index from "@/Index";
import GlobalError from "@/components/GlobalError";
import Protected from "@/components/Protected";
import RightPane from "@/components/RightPane";
import Signin from "@/components/Signin";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<GlobalError />}>
      <Route path="/signin" element={<Signin />} />

      <Route
        path="/"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<Index />} />
        <Route path="/:pageId" element={<RightPane />} />
      </Route>
    </Route>,
  ),
);

export default router;
