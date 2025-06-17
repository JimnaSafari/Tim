
import React from 'react';
import { FileText } from 'lucide-react';

interface SchedulePreviewProps {
  batchType: 'weekly' | 'daily';
  maxMembers: number;
  weeklyPayout: number;
  dailyPayout: number;
}

const SchedulePreview = ({ batchType, maxMembers, weeklyPayout, dailyPayout }: SchedulePreviewProps) => {
  const payoutAmount = batchType === 'weekly' ? weeklyPayout : dailyPayout;
  
  if (maxMembers <= 0 || payoutAmount <= 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        {batchType === 'weekly' ? 'Payout Schedule Preview' : 'Daily Payout Schedule'}
      </h4>
      
      <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
        {Array.from({ length: maxMembers }, (_, i) => (
          <div key={i} className="flex justify-between text-gray-300">
            <span>
              {batchType === 'weekly' ? `Week ${i + 1}` : `Day ${i + 1}`} - Member {i + 1}:
            </span>
            <span className="text-green-400">
              KES {payoutAmount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePreview;
