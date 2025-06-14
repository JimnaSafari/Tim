
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff } from 'lucide-react';

interface BalanceCardProps {
  showBalance: boolean;
  savingsBalance: number;
  monthlyTotal: number;
  batchesCount: number;
  onToggleBalance: () => void;
  onAddMoney: () => void;
}

const BalanceCard = ({ 
  showBalance, 
  savingsBalance, 
  monthlyTotal, 
  batchesCount,
  onToggleBalance, 
  onAddMoney 
}: BalanceCardProps) => {
  return (
    <Card className="glassmorphism p-6 mb-6 border-0 relative overflow-hidden hover-lift stagger-item">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-400 text-sm">Total Balance</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBalance}
                className="p-1 h-auto text-gray-400 hover:text-white interactive-button"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
            <h2 className="text-3xl font-bold text-white animate-scale-in">
              {showBalance ? `KES ${savingsBalance.toLocaleString()}` : '••••••'}
            </h2>
          </div>
          <Button 
            size="sm" 
            className="gradient-primary text-white border-0 rounded-full px-4 interactive-button ripple-effect"
            onClick={onAddMoney}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="flex justify-between mt-6">
          <div className="animate-slide-up">
            <p className="text-gray-400 text-xs">This Month</p>
            <p className="text-lg font-semibold text-white">
              {showBalance ? `KES ${monthlyTotal.toLocaleString()}` : '••••••'}
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-gray-400 text-xs">In Batches</p>
            <p className="text-lg font-semibold text-white">
              {showBalance ? `KES ${(batchesCount * 1000).toLocaleString()}` : '••••••'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;
