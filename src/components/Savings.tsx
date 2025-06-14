
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PiggyBank, ArrowUp, ArrowDown, Clock, Eye, EyeOff } from 'lucide-react';

const Savings = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const handleWithdrawalRequest = () => {
    if (withdrawalAmount) {
      console.log('Withdrawal request submitted:', withdrawalAmount);
      setShowWithdrawalForm(false);
      setWithdrawalAmount('');
      // Here you would integrate with backend to process withdrawal request
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" size="sm" className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">My Savings</h1>
        <div className="w-8"></div>
      </div>

      {/* Savings Balance Card */}
      <Card className="glassmorphism p-6 mb-6 border-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="w-5 h-5 text-green-400" />
                <p className="text-gray-400 text-sm">Total Savings</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 h-auto text-gray-400 hover:text-white"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <h2 className="text-3xl font-bold text-white">
                {showBalance ? 'KES 15,750' : '••••••'}
              </h2>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div>
              <p className="text-gray-400 text-xs">Available</p>
              <p className="text-lg font-semibold text-white">
                {showBalance ? 'KES 15,750' : '••••••'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">This Month</p>
              <p className="text-lg font-semibold text-green-400">
                {showBalance ? '+KES 2,500' : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0 hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Save Money</p>
              <p className="text-gray-400 text-xs">Add to savings</p>
            </div>
          </div>
        </Card>

        <Card 
          className="glassmorphism-dark p-4 border-0 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowWithdrawalForm(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Request Withdrawal</p>
              <p className="text-gray-400 text-xs">48hr processing</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Request Withdrawal</h3>
            <p className="text-gray-400 text-sm mb-4">
              Withdrawals take 48 hours to process. Funds will be sent to your registered M-PESA number.
            </p>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Amount (KES)</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white"
                placeholder="Enter amount"
                max="15750"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowWithdrawalForm(false)}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleWithdrawalRequest}
                className="flex-1 gradient-primary text-white"
                disabled={!withdrawalAmount}
              >
                Request
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Pending Withdrawals */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Pending Requests</h3>
        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-white">Withdrawal Request</p>
                <p className="text-sm text-gray-400">KES 5,000 • 24 hours remaining</p>
              </div>
            </div>
            <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">
              Processing
            </span>
          </div>
        </Card>
      </div>

      {/* Savings History */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
        <div className="space-y-3">
          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Auto Save</p>
                  <p className="text-sm text-gray-400">From payout</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-400">+KES 2,500</p>
                <p className="text-xs text-gray-500">2d ago</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Withdrawal</p>
                  <p className="text-sm text-gray-400">To M-PESA</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-400">-KES 3,000</p>
                <p className="text-xs text-gray-500">1w ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Savings;
