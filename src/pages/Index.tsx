
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Batches from '@/components/Batches';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'batches':
        return <Batches />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Profile />; // For now, settings shows profile
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
