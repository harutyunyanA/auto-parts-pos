import { createBrowserRouter, Navigate } from "react-router-dom";
import UserSelection from "../pages/Auth/UserSelection";
import MainLayout from "../layouts/MainLayout";
import DeskGuard from "../components/DeskGuard";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import { Base } from "../pages/Base";
import Deficit from "../pages/Deficit";
import Settings from "../pages/Settings";
import Suppliers from "../pages/Suppliers";
import SupplierDetail from "../pages/SupplierDetail";
import Clients from "../pages/Clients";
import ClientDetail from "../pages/ClientDetail";
import Discounts from "../pages/Discounts";

export const router = createBrowserRouter([
  {
    path: "/selection",
    element: <UserSelection />,
  },
  {
    path: "/",
    element: <DeskGuard />,
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
            path: "suppliers",
            element: <Suppliers />,
          },
          {
            path: "suppliers/:id",
            element: <SupplierDetail />,
          },
          {
            path: "clients",
            element: <Clients />,
          },
          {
            path: "clients/:id",
            element: <ClientDetail />,
          },
          {
            path: "discounts",
            element: <Discounts />,
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
