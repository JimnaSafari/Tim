
import React from 'react';
import { Home, Users, User, Grid3X3 } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'batches', icon: Users },
    { id: 'settings', icon: Grid3X3 },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glassmorphism-dark border-t border-white/10 px-4 py-3 safe-area-bottom">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'gradient-primary' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {isActive && (
                <div className="absolute -bottom-6 w-1 h-1 bg-cyan-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
