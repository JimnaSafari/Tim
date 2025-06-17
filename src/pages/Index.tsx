
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Batches from '@/components/Batches';
import Savings from '@/components/Savings';
import Loans from '@/components/Loans';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';
import Chatbot from '@/components/Chatbot';
import SplashScreen from '@/components/SplashScreen';
import Auth from '@/components/Auth';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleAuthSuccess = () => {
    // Auth success will be handled by the useAuth hook automatically
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'batches':
        return <Batches />;
      case 'savings':
        return <Savings />;
      case 'loans':
        return <Loans />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <Chatbot />
    </div>
  );
};

export default Index;
