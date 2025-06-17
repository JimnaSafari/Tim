
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAvatarUpload = (initialAvatarUrl?: string) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl || null);

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
      console.log('Starting avatar upload for user:', userId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading to path:', filePath);

      // Remove old avatar if it exists
      if (initialAvatarUrl) {
        const oldFileName = initialAvatarUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  return {
    avatarFile,
    avatarPreview,
    handleAvatarChange,
    uploadAvatar
  };
};
