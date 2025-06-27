
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-blue-600 flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/logo-am.png" 
          alt="Arihant Medigens" 
          className="h-24 w-auto mx-auto mb-6 animate-scale-in"
        />
        <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
          Arihant Medigens
        </h1>
        <p className="text-blue-100 animate-fade-in">
          Your Trusted Medical Partner
        </p>
        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
