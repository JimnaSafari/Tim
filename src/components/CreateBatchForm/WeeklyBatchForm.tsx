
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface WeeklyBatchFormProps {
  weeklyContribution: string;
  maxMembers: string;
  onWeeklyContributionChange: (value: string) => void;
  onMaxMembersChange: (value: string) => void;
}

const WeeklyBatchForm = ({ 
  weeklyContribution, 
  maxMembers, 
  onWeeklyContributionChange, 
  onMaxMembersChange 
}: WeeklyBatchFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300 text-sm">Weekly Contribution (KES) *</Label>
        <Input
          type="number"
          value={weeklyContribution}
          onChange={(e) => onWeeklyContributionChange(e.target.value)}
          placeholder="1000"
          className="bg-gray-800/50 border-gray-600 text-white mt-1"
          required
          min="100"
        />
      </div>

      <div>
        <Label className="text-gray-300 text-sm">Members (2-20) *</Label>
        <Input
          type="number"
          value={maxMembers}
          onChange={(e) => onMaxMembersChange(e.target.value)}
          placeholder="10"
          className="bg-gray-800/50 border-gray-600 text-white mt-1"
          required
          min="2"
          max="20"
        />
      </div>
    </div>
  );
};

export default WeeklyBatchForm;
