
import React, { useState } from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
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
  onClose,
  onSuccess
}: EditProfileFormProps) => {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [loading, setLoading] = useState(false);

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
      
      // Update name in public.profiles using the authenticated user's ID
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name })
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
