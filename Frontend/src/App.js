import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ProductProvider } from "./contexts/ProductContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

const AppContent = () => {
  const hideFooterPaths = ["/login", "/register", "/dashboard", "/403", "/404"];
  const { pathname } = useLocation();
  const showFooter = !hideFooterPaths.some((p) => pathname.startsWith(p));

  return (
    <>
      <ScrollToTop />
      <Header />
      <AppRoutes />
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
