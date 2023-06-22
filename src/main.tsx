import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { DirectoryProvider } from "./context/DirectoryContext.tsx";
import Root, { loader } from "./routes/Root.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Entries, { entriesLoader } from "./routes/Entries.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <Error />,
    loader: loader,
    children: [
      {
        path: "/:path",
        element: <Entries />,
        loader: entriesLoader,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <DirectoryProvider>
      <RouterProvider router={router} />
    </DirectoryProvider>
  </React.StrictMode>
);
