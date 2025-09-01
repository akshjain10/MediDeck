'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import ScrollToTop from "@/components/ScrollToTop"
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SplashScreen from "./SplashScreen";

const queryClient = new QueryClient();

interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: AppProps) => {
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
        <ScrollToTop />
        {children}
        <Footer />
        <ContactButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;