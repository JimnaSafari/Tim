
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Batches from '@/components/Batches';
import Savings from '@/components/Savings';
import Loans from '@/components/Loans';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';
import Chatbot from '@/components/Chatbot';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <Chatbot />
    </div>
  );
};

export default Index;
