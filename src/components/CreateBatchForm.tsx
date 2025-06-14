
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';

interface CreateBatchFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBatchForm = ({ onClose, onSuccess }: CreateBatchFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyContribution: '',
    maxMembers: '10'
  });
  
  const { createBatch, loading } = useBatches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.monthlyContribution) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createBatch({
        name: formData.name,
        description: formData.description,
        monthlyContribution: Number(formData.monthlyContribution),
        maxMembers: Number(formData.maxMembers)
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glassmorphism p-6 border-0 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Create New Batch</h3>
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
            <label className="block text-gray-300 text-sm mb-2">Batch Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Friends Circle"
              className="bg-gray-800/50 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your batch"
              className="bg-gray-800/50 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Monthly Contribution (KES) *</label>
            <Input
              type="number"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
              placeholder="1000"
              className="bg-gray-800/50 border-gray-600 text-white"
              required
              min="100"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Maximum Members</label>
            <Input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
              placeholder="10"
              className="bg-gray-800/50 border-gray-600 text-white"
              min="2"
              max="50"
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
              {loading ? 'Creating...' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateBatchForm;
