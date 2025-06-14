
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onSignOut: () => void;
}

const ProfileCard = ({ name, email, avatarUrl, onSignOut }: ProfileCardProps) => {
  return (
    <Card className="glassmorphism p-6 mb-6 border-0 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl"></div>
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gray-700 flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-white mb-1">{name}</h2>
        <p className="text-gray-400 mb-2">{email}</p>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:text-white mt-3"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
