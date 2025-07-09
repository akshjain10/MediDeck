
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import ScrollToTop from "@/components/ScrollToTop"
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Order from "./pages/Order";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const initTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(initTimer);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash && isAppReady) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!isAppReady) {
    return null; // Show nothing while app is initializing
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/order" element={<Order />} />
            <Route path="/privacy" element={<PrivacyPolicy/>} />
            <Route path="/admin" element={<Admin/>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ContactButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
