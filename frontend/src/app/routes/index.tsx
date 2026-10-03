import { createBrowserRouter } from "react-router-dom";

import NotFound from "@/pages/NotFound";
// import Workbook from "@/pages/Workbook";
// import Test from "@/pages/Test";
import Home from "@/pages/Home";
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    // {
    //   path: "/test",
    //   element: <Workbook />,
    // },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: "/sheet_clone",
  },
);
