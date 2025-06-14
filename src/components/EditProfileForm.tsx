
import React, { useState } from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { X, Upload, User } from "lucide-react";

interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialAvatarUrl?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Simple toast function to avoid any import issues
const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transition-all duration-300 ${
    variant === 'destructive' 
      ? 'bg-red-600 text-white border border-red-700' 
      : 'bg-green-600 text-white border border-green-700'
  }`;
  
  toastEl.innerHTML = `
    <div class="font-medium">${title}</div>
    <div class="text-sm opacity-90 mt-1">${description}</div>
  `;
  
  document.body.appendChild(toastEl);
  
  setTimeout(() => {
    toastEl.style.transform = 'translateX(0)';
    toastEl.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    if (document.body.contains(toastEl)) {
      toastEl.style.transform = 'translateX(100%)';
      toastEl.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl);
        }
      }, 300);
    }
  }, 3000);
};

const EditProfileForm = ({
  initialName,
  initialEmail,
  initialAvatarUrl,
  onClose,
  onSuccess
}: EditProfileFormProps) => {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl || null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

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

      showToast("Profile updated!", "Your info was updated successfully.", "default");
      onSuccess();
    } catch (err: any) {
      console.error('Update failed:', err);
      showToast(
        "Update failed",
        err?.message || "Unable to update profile.",
        "destructive"
      );
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
          {/* Avatar Upload Section */}
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
                onChange={handleAvatarChange}
                className="hidden"
                disabled={loading}
              />
            </div>
            <p className="text-gray-400 text-sm">Click the icon to upload a new picture</p>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={loading}
              required
            />
          </div>
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
