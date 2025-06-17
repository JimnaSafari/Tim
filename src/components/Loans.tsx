
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, CheckCircle, XCircle, AlertCircle, Calculator } from 'lucide-react';

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);
  
  // User data - in real app this would come from backend
  const userEligible = true; // User has been active for 2+ months
  const nextPayoutAmount = 12000;
  const maxLoanAmount = Math.floor(nextPayoutAmount * 0.83); // 83% of payout
  const monthsActive = 8;

  const handleLoanRequest = () => {
    if (loanAmount && parseInt(loanAmount) <= maxLoanAmount) {
      console.log('Loan request submitted:', loanAmount);
      setShowLoanForm(false);
      setLoanAmount('');
      // Here you would integrate with backend to process loan request
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" size="sm" className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">Loans</h1>
        <div className="w-8"></div>
      </div>

      {/* Eligibility Status */}
      <Card className="glassmorphism p-6 mb-6 border-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {userEligible ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <h2 className="text-xl font-semibold text-white">
              {userEligible ? 'Loan Eligible' : 'Not Eligible'}
            </h2>
          </div>
          
          {userEligible ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Months Active:</span>
                <span className="text-white font-medium">{monthsActive} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Payout:</span>
                <span className="text-white font-medium">KES {nextPayoutAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Loan Amount:</span>
                <span className="text-green-400 font-bold">KES {maxLoanAmount.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                You need to use the app consistently for at least 2 months to be eligible for loans.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Loan Calculator */}
      {userEligible && (
        <Card className="glassmorphism-dark p-5 border-0 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Loan Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Loan Amount (KES)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white"
                placeholder="Enter amount"
                max={maxLoanAmount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: KES {maxLoanAmount.toLocaleString()}
              </p>
            </div>
            
            {loanAmount && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Loan Terms:
                </p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Amount will be deducted from your next payout</li>
                  <li>• Remaining payout: KES {(nextPayoutAmount - parseInt(loanAmount || '0')).toLocaleString()}</li>
                  <li>• Funds sent to registered M-PESA number only</li>
                  <li>• Instant approval for eligible members</li>
                </ul>
              </div>
            )}
            
            <Button 
              onClick={() => setShowLoanForm(true)}
              className="w-full gradient-primary text-white"
              disabled={!loanAmount || parseInt(loanAmount) > maxLoanAmount || parseInt(loanAmount) <= 0}
            >
              Apply for Loan
            </Button>
          </div>
        </Card>
      )}

      {/* Loan Application Modal */}
      {showLoanForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Loan Application</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Loan Amount:</span>
                <span className="text-white font-medium">KES {parseInt(loanAmount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Payout:</span>
                <span className="text-white font-medium">KES {nextPayoutAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">After Deduction:</span>
                <span className="text-green-400 font-medium">KES {(nextPayoutAmount - parseInt(loanAmount || '0')).toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 text-xs">
                By applying, you agree that this loan amount will be automatically deducted from your next merry-go-round payout.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowLoanForm(false)}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLoanRequest}
                className="flex-1 gradient-primary text-white"
              >
                Confirm Loan
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Active Loans */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Active Loans</h3>
        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white">Emergency Loan</p>
                <p className="text-sm text-gray-400">KES 8,000 • Auto-deduct from next payout</p>
              </div>
            </div>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
              Active
            </span>
          </div>
        </Card>
      </div>

      {/* Loan History */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Loan History</h3>
        <div className="space-y-3">
          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Quick Loan</p>
                  <p className="text-sm text-gray-400">KES 5,000 • Repaid</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Dec 2024</p>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">
                  Paid
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loans;
