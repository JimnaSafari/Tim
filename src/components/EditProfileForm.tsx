
import React, { useState } from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AvatarUpload from './EditProfileForm/AvatarUpload';
import ProfileFormFields from './EditProfileForm/ProfileFormFields';
import { useAvatarUpload } from './EditProfileForm/AvatarUploadLogic';

interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialAvatarUrl?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProfileForm = ({
  initialName,
  initialEmail,
  initialAvatarUrl,
  onClose,
  onSuccess
}: EditProfileFormProps) => {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { avatarFile, avatarPreview, handleAvatarChange, uploadAvatar } = useAvatarUpload(initialAvatarUrl);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting profile update...', { name, email, initialEmail });
      
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No valid session found');
      }

      console.log('Session found, updating profile...');
      
      let avatarUrl = initialAvatarUrl;
      
      // Upload new avatar if selected
      if (avatarFile) {
        console.log('Uploading new avatar...');
        const uploadedUrl = await uploadAvatar(avatarFile, session.user.id);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          console.log('Avatar uploaded successfully:', uploadedUrl);
        } else {
          throw new Error('Failed to upload avatar');
        }
      }

      // Update profile with name and avatar
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          full_name: name,
          avatar_url: avatarUrl
        })
        .eq("id", session.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully');

      let emailError = null;
      // Only update email if changed
      if (email !== initialEmail) {
        console.log('Updating email...');
        const { error } = await supabase.auth.updateUser({ email });
        emailError = error;
        if (emailError) {
          console.error('Email update error:', emailError);
        }
      }

      if (emailError) {
        throw emailError;
      }

      toast({
        title: "Profile updated!",
        description: "Your info was updated successfully.",
      });
      onSuccess();
    } catch (err: any) {
      console.error('Update failed:', err);
      toast({
        title: "Update failed",
        description: err?.message || "Unable to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2">
      <Card className="glassmorphism p-6 border-0 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>
        <form onSubmit={handleUpdate} className="space-y-5">
          <AvatarUpload
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            loading={loading}
          />

          <ProfileFormFields
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
            loading={loading}
          />

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfileForm;
