import { createHashRouter, Navigate } from "react-router-dom";
import UserSelection from "../pages/Auth/UserSelection";
import ServerSetup from "../pages/Auth/ServerSetup";
import MainLayout from "../layouts/MainLayout";
import SourceGuard from "../components/SourceGuard";
import ServerGuard from "../components/ServerGuard";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import { Base } from "../pages/Base";
import Deficit from "../pages/Deficit";

export const router = createHashRouter([
  {
    path: "/server-setup",
    element: <ServerSetup />,
  },
  {
    path: "/selection",
    element: <UserSelection />,
  },
  {
    path: "/",
    element: <ServerGuard />,
    children: [
      {
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
            ],
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
