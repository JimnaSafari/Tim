
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useSavings } from '@/hooks/useSavings';
import { toast } from 'sonner';

interface SaveMoneyFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SaveMoneyForm = ({ onClose, onSuccess }: SaveMoneyFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { deposit, loading } = useSavings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await deposit(Number(amount), description || undefined);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving money:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Save Money</h3>
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
            <label className="block text-gray-300 text-sm mb-2">Amount (KES)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to save"
              className="bg-gray-800/50 border-gray-600 text-white"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              className="bg-gray-800/50 border-gray-600 text-white resize-none"
              rows={3}
            />
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Money'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SaveMoneyForm;
