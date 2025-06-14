
import React from 'react';
import { Input } from '@/components/ui/input';

interface ProfileFormFieldsProps {
  name: string;
  email: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  loading: boolean;
}

const ProfileFormFields = ({ 
  name, 
  email, 
  onNameChange, 
  onEmailChange, 
  loading 
}: ProfileFormFieldsProps) => {
  return (
    <>
      <div>
        <label className="block text-gray-300 mb-1">Full Name</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          disabled={loading}
          required
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          disabled={loading}
          required
        />
      </div>
    </>
  );
};

export default ProfileFormFields;
