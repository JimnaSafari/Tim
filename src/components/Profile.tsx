
import React, { useState } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import EditProfileForm from './EditProfileForm';
import ProfileHeader from './ProfileHeader';
import ProfileCard from './ProfileCard';
import ProfileStats from './ProfileStats';
import ProfileMenuItems from './ProfileMenuItems';

const Profile = () => {
  const { userData, loading, refreshUserData } = useUserData();
  const { signOut } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const name = userData?.profile?.full_name || 'User';
  const email = userData?.profile?.email || userData?.email || 'unknown@email.com';
  const avatarUrl = userData?.profile?.avatar_url;

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      <ProfileHeader onEditClick={() => setShowEdit(true)} />
      
      <ProfileCard
        name={name}
        email={email}
        avatarUrl={avatarUrl}
        onSignOut={signOut}
      />

      <ProfileStats />

      <ProfileMenuItems />

      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfileForm
          initialName={name}
          initialEmail={email}
          initialAvatarUrl={avatarUrl}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            refreshUserData();
          }}
        />
      )}
    </div>
  );
};

export default Profile;
