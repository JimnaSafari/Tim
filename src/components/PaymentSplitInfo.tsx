
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Smartphone, Info } from 'lucide-react';
import { mpesaService, PaymentSplit } from '@/services/mpesaService';

interface PaymentSplitInfoProps {
  checkoutRequestId: string;
  totalAmount: number;
}

const PaymentSplitInfo = ({ checkoutRequestId, totalAmount }: PaymentSplitInfoProps) => {
  const [splits, setSplits] = useState<PaymentSplit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const splitData = await mpesaService.getPaymentSplits(checkoutRequestId);
        setSplits(splitData);
      } catch (error) {
        console.error('Failed to fetch payment splits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSplits();
  }, [checkoutRequestId]);

  if (loading) {
    return (
      <Card className="glassmorphism-dark p-4 border-0">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!splits) {
    return null;
  }

  return (
    <Card className="glassmorphism-dark p-4 border-0">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm font-medium text-white">Payment Distribution</h4>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Total Payment</span>
          <span className="text-white font-medium">KES {totalAmount.toLocaleString()}</span>
        </div>

        <div className="border-t border-gray-600 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">Service Fee</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">KES {splits.serviceFee}</div>
              <div className="text-xs text-gray-400">{splits.destination.serviceFee}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {splits.destination.poolType === 'bank' ? (
                <Building className="w-4 h-4 text-blue-400" />
              ) : (
                <Smartphone className="w-4 h-4 text-green-400" />
              )}
              <span className="text-gray-300 text-sm">Pool Contribution</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">KES {splits.poolContribution.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{splits.destination.poolMoney}</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
          <p className="text-blue-400 text-xs">
            {splits.destination.poolType === 'bank' 
              ? 'Pool money will be transferred to the bank account as it exceeds KES 150,000'
              : 'Pool money will be held in the M-Pesa account'
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PaymentSplitInfo;
