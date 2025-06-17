
import React from 'react';
import { Upload, User } from 'lucide-react';

interface AvatarUploadProps {
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const AvatarUpload = ({ avatarPreview, onAvatarChange, loading }: AvatarUploadProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label 
          htmlFor="avatar-upload"
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors"
        >
          <Upload className="w-4 h-4 text-white" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          className="hidden"
          disabled={loading}
        />
      </div>
      <p className="text-gray-400 text-sm">Click the icon to upload a new picture</p>
    </div>
  );
};

export default AvatarUpload;
