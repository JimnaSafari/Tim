
import React, { useState } from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

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
      // Update name in public.profiles (via edge function or via RPC or direct table update)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("email", initialEmail);

      let emailError = null;
      // Only update email if changed
      if (email !== initialEmail) {
        const { error } = await supabase.auth.updateUser({ email });
        emailError = error;
      }

      if (profileError || emailError) {
        throw profileError || emailError;
      }

      toast({ title: "Profile updated!", description: "Your info was updated." });
      onSuccess();
    } catch (err: any) {
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

