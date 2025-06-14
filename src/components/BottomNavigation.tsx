
import React from 'react';
import { Home, Users, User, PiggyBank, CreditCard } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'batches', icon: Users },
    { id: 'savings', icon: PiggyBank },
    { id: 'loans', icon: CreditCard },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glassmorphism-dark border-t border-white/10 px-4 py-3 safe-area-bottom animate-slide-up">
      <div className="flex justify-around items-center">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 interactive-button ripple-effect stagger-item ${
                isActive 
                  ? 'gradient-primary animate-pulse-glow' 
                  : 'text-gray-500 hover:text-gray-300 hover-lift'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className={`w-6 h-6 transition-all duration-300 ${
                isActive ? 'text-white animate-bounce-in' : 'text-gray-400'
              }`} />
              {isActive && (
                <div className="absolute -bottom-6 w-1 h-1 bg-cyan-400 rounded-full animate-scale-in"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
