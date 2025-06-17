
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Transaction {
  id: string;
  transaction_type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
  created_at: string;
}

interface RecentActivityProps {
  recentSavings?: Transaction[];
}

const RecentActivity = ({ recentSavings }: RecentActivityProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Recent Activity</h3>
      <div className="space-y-3">
        {recentSavings && recentSavings.length > 0 ? (
          recentSavings.slice(0, 3).map((transaction: Transaction) => (
            <Card key={transaction.id} className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${
                    transaction.transaction_type === 'deposit' 
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  } flex items-center justify-center animate-bounce-in`}>
                    {transaction.transaction_type === 'deposit' ? (
                      <ArrowDown className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowUp className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {transaction.transaction_type === 'deposit' ? 'Money Saved' : 'Withdrawal'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {transaction.description || 'Personal savings'}
                    </p>
                  </div>
                </div>
                <div className="text-right animate-scale-in">
                  <p className={`font-semibold ${
                    transaction.transaction_type === 'deposit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.transaction_type === 'deposit' ? '+' : '-'}KES {Number(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
                  <ArrowDown className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Welcome!</p>
                  <p className="text-sm text-gray-400">Start saving or join a batch</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
