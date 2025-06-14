
import React from 'react';
import { Calculator } from 'lucide-react';

interface FinancialBreakdownProps {
  batchType: 'weekly' | 'daily';
  calculations: {
    totalOneTimePayment: number;
    totalPooledAmount: number;
    totalServiceFees: number;
    weeklyPayout: number;
    dailyPayout: number;
    organizerEarnings: number;
  };
}

const FinancialBreakdown = ({ batchType, calculations }: FinancialBreakdownProps) => {
  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Calculator className="w-4 h-4" />
        Financial Breakdown
      </h4>
      
      <div className="space-y-3 text-sm">
        {batchType === 'weekly' ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Payment/Member/Week:</span>
              <span className="text-green-400 font-semibold">
                KES {calculations.totalOneTimePayment.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Weekly Payout Amount:</span>
              <span className="text-blue-400 font-semibold">
                KES {calculations.weeklyPayout.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Total Pooled Amount:</span>
              <span className="text-purple-400 font-semibold">
                KES {calculations.totalPooledAmount.toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">One-Time Payment/Member:</span>
              <span className="text-green-400 font-semibold">
                KES {calculations.totalOneTimePayment.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Payout Amount:</span>
              <span className="text-blue-400 font-semibold">
                KES {calculations.dailyPayout.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Total Pool (10 Days):</span>
              <span className="text-purple-400 font-semibold">
                KES {calculations.totalPooledAmount.toLocaleString()}
              </span>
            </div>
          </>
        )}
        
        <div className="flex justify-between border-t border-gray-600 pt-2">
          <span className="text-gray-400">Organizer Earnings:</span>
          <span className="text-cyan-400 font-semibold">
            KES {calculations.organizerEarnings.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdown;
