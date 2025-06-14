
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DailyBatchFormProps {
  oneTimeContribution: string;
  onOneTimeContributionChange: (value: string) => void;
}

const DailyBatchForm = ({ oneTimeContribution, onOneTimeContributionChange }: DailyBatchFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300 text-sm">One-Time Contribution (KES) *</Label>
        <Input
          type="number"
          value={oneTimeContribution}
          onChange={(e) => onOneTimeContributionChange(e.target.value)}
          placeholder="10000"
          className="bg-gray-800/50 border-gray-600 text-white mt-1"
          required
          min="1000"
        />
      </div>

      <div>
        <Label className="text-gray-300 text-sm">Members (Fixed: 10)</Label>
        <Input
          type="number"
          value="10"
          disabled
          className="bg-gray-700/50 border-gray-600 text-gray-400 mt-1"
        />
      </div>
    </div>
  );
};

export default DailyBatchForm;
