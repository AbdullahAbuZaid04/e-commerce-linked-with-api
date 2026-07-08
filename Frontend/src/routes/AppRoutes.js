import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Forbidden from "../pages/Forbidden";

const Products = lazy(() => import("../pages/Products"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Admin = lazy(() => import("../pages/Admin"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const NotFound = lazy(() => import("../pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex justify-center py-10">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <Products />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:slug"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <ProductDetails />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <Cart />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <Admin />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <OrderSuccess />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute forbiddenRoles={["ADMIN"]}>
            <Suspense fallback={<LoadingFallback />}>
              <MyOrders />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="/403" element={<Forbidden />} />
      <Route
        path="/404"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
