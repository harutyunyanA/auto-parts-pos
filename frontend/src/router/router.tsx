import { createBrowserRouter, Navigate } from "react-router-dom";
import UserSelection from "../pages/Auth/UserSelection";
import MainLayout from "../layouts/MainLayout";
import SourceGuard from "../components/SourceGuard";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import { Base } from "../pages/Base";
import Deficit from "../pages/Deficit";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/selection",
    element: <UserSelection />,
  },
  {
    path: "/",
    element: <SourceGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "sales",
            element: <Sales />,
          },
          {
            path: "base",
            element: <Base />,
          },
          {
            path: "deficit",
            element: <Deficit />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
