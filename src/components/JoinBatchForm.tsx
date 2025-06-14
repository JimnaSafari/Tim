
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';

interface JoinBatchFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const JoinBatchForm = ({ onClose, onSuccess }: JoinBatchFormProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const { joinBatch, loading } = useBatches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    try {
      await joinBatch(inviteCode.trim().toUpperCase());
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error joining batch:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Join Batch</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Invite Code</label>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              className="bg-gray-800/50 border-gray-600 text-white text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              Get the invite code from your batch organizer
            </p>
          </div>

          <div className="flex gap-3 pt-4">
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
              disabled={loading || inviteCode.length !== 6}
            >
              {loading ? 'Joining...' : 'Join Batch'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JoinBatchForm;
