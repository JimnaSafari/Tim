
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  userName: string;
  userInitials: string;
  avatarUrl?: string;
}

const DashboardHeader = ({ userName, userInitials, avatarUrl }: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col items-center mb-8 pt-12 animate-fade-in">
      <div className="w-16 h-16 rounded-full overflow-hidden hover-lift mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage 
            src={avatarUrl} 
            alt={userName}
          />
          <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-purple-600 text-white font-semibold text-lg">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm">{getGreeting()}</p>
        <h1 className="text-xl font-medium text-white">{userName}</h1>
      </div>
    </div>
  );
};

export default DashboardHeader;
