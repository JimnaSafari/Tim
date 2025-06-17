
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface BatchTypeSelectorProps {
  batchType: 'weekly' | 'daily';
  onBatchTypeChange: (value: 'weekly' | 'daily') => void;
}

const BatchTypeSelector = ({ batchType, onBatchTypeChange }: BatchTypeSelectorProps) => {
  return (
    <div>
      <Label className="text-gray-300 text-sm">Batch Type *</Label>
      <Select value={batchType} onValueChange={onBatchTypeChange}>
        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white mt-1">
          <SelectValue placeholder="Select batch type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          <SelectItem value="weekly" className="text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Weekly Contributions
            </div>
          </SelectItem>
          <SelectItem value="daily" className="text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Daily Payouts (10-Day)
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BatchTypeSelector;
