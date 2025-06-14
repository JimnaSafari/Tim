
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Calendar, Filter } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Statements = () => {
  const { userData, loading } = useUserData();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading statements...</p>
        </div>
      </div>
    );
  }

  const handleDownloadStatement = (type: string) => {
    // Simple implementation - in real app, this would generate and download actual statements
    const blob = new Blob([`${type} Statement - Generated on ${new Date().toLocaleDateString()}`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase()}-statement-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white p-2" 
          onClick={() => navigate('/')}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">Statements & Reports</h1>
        <Button variant="ghost" size="sm" className="text-white p-2" aria-label="Filter">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Savings</p>
              <p className="font-semibold text-white">{formatCurrency(userData?.savingsBalance || 0)}</p>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="font-semibold text-white">{formatCurrency(userData?.monthlyTotal || 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Downloads */}
      <Card className="glassmorphism p-6 mb-6 border-0">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Downloads</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white justify-between h-12"
            onClick={() => handleDownloadStatement('Savings')}
          >
            <span>Savings Statement</span>
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white justify-between h-12"
            onClick={() => handleDownloadStatement('Transaction')}
          >
            <span>Transaction Report</span>
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white justify-between h-12"
            onClick={() => handleDownloadStatement('Monthly')}
          >
            <span>Monthly Summary</span>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="glassmorphism p-6 border-0">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        {userData?.recentSavings && userData.recentSavings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.recentSavings.map((transaction: any) => (
                <TableRow key={transaction.id} className="border-gray-700">
                  <TableCell className="text-gray-300">
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-300 capitalize">
                    {transaction.transaction_type}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.transaction_type === 'deposit' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {transaction.transaction_type === 'deposit' ? '+' : '-'}
                    {formatCurrency(Number(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No transactions found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Statements;
