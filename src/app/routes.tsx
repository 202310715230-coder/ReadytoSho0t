import { createBrowserRouter, Navigate } from "react-router-dom";

// Layout
import { CustomerLayout, AdminLayout } from "./Root";

// Route Protection
import { PrivateRoute } from "./components/PrivateRoute";

// Customer Pages
import Home from "./pages/customers/Home";
import Catalog from "./pages/customers/Catalog";
import ProductDetail from "./pages/customers/ProductDetail";
import Booking from "./pages/customers/Booking";
import Profile from "./pages/customers/Profile";

// Admin Pages
import AdminDashboard from "./pages/admins/AdminDashboard";
import AdminProducts from "./pages/admins/Products";
import AdminOrders from "./pages/admins/Orders";
import AdminUsers from "./pages/admins/Users";

// Auth & Global Pages
import Login from "./pages/auth/Login";
import Registrasi from "./pages/auth/Registrasi";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  // ===============================
  // AUTH ROUTES
  // ===============================
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/registrasi",
    element: <Registrasi />,
    errorElement: <NotFound />,
  },

  // ===============================
  // CUSTOMER ROUTES
  // ===============================
  {
    path: "/",
    element: <CustomerLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "booking/:id",
        element: (
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ===============================
  // ADMIN ROUTES
  // ===============================
  {
    path: "/admin",
    element: (
      <PrivateRoute requireAdmin>
        <AdminLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "*",
        element: (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        ),
      },
    ],
  },

  // ===============================
  // GLOBAL NOT FOUND
  // ===============================
  {
    path: "*",
    element: <NotFound />,
  },
]);