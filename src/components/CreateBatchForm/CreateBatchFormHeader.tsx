
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Users } from 'lucide-react';

interface CreateBatchFormHeaderProps {
  onClose: () => void;
}

const CreateBatchFormHeader = ({ onClose }: CreateBatchFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <Users className="w-5 h-5" />
        Create New TiM Chama Batch
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-gray-400 hover:text-white p-1"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default CreateBatchFormHeader;
