
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Edit } from 'lucide-react';

interface ProfileHeaderProps {
  onEditClick: () => void;
}

const ProfileHeader = ({ onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pt-12">
      <Button variant="ghost" size="sm" className="text-white p-2" aria-label="Back">
        <User className="w-5 h-5" />
      </Button>
      <h1 className="text-xl font-medium">Profile</h1>
      <Button
        variant="ghost"
        size="sm"
        className="text-white p-2"
        aria-label="Edit Profile"
        onClick={onEditClick}
      >
        <Edit className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ProfileHeader;
