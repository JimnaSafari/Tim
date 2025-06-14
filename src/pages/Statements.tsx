
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
import jsPDF from 'jspdf';

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
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Set up the PDF document
    doc.setFontSize(20);
    doc.text(`${type} Statement`, 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${formattedDate}`, 20, 45);
    doc.text(`Account Holder: ${userData?.profile?.full_name || 'N/A'}`, 20, 55);
    doc.text(`Phone: ${userData?.profile?.phone_number || 'N/A'}`, 20, 65);

    let yPosition = 85;

    if (type === 'Savings') {
      doc.setFontSize(16);
      doc.text('Savings Summary', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.text(`Current Savings Balance: ${formatCurrency(userData?.savingsBalance || 0)}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Total Savings: ${formatCurrency(userData?.totalSavings || 0)}`, 20, yPosition);
      yPosition += 10;
      doc.text(`This Month: ${formatCurrency(userData?.monthlyTotal || 0)}`, 20, yPosition);
      yPosition += 20;

      if (userData?.recentSavings && userData.recentSavings.length > 0) {
        doc.setFontSize(14);
        doc.text('Recent Transactions', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(10);
        doc.text('Date', 20, yPosition);
        doc.text('Type', 70, yPosition);
        doc.text('Amount', 120, yPosition);
        yPosition += 10;

        userData.recentSavings.forEach((transaction: any) => {
          const date = new Date(transaction.created_at).toLocaleDateString();
          const amount = `${transaction.transaction_type === 'deposit' ? '+' : '-'}${formatCurrency(Number(transaction.amount))}`;
          
          doc.text(date, 20, yPosition);
          doc.text(transaction.transaction_type, 70, yPosition);
          doc.text(amount, 120, yPosition);
          yPosition += 8;

          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }
    } else if (type === 'Transaction') {
      doc.setFontSize(16);
      doc.text('Transaction Report', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.text(`Report Period: ${formattedDate}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Total Transactions: ${userData?.recentSavings?.length || 0}`, 20, yPosition);
      yPosition += 20;

      if (userData?.recentSavings && userData.recentSavings.length > 0) {
        doc.setFontSize(10);
        doc.text('Date', 20, yPosition);
        doc.text('Type', 60, yPosition);
        doc.text('Description', 100, yPosition);
        doc.text('Amount', 150, yPosition);
        yPosition += 10;

        userData.recentSavings.forEach((transaction: any) => {
          const date = new Date(transaction.created_at).toLocaleDateString();
          const amount = `${transaction.transaction_type === 'deposit' ? '+' : '-'}${formatCurrency(Number(transaction.amount))}`;
          
          doc.text(date, 20, yPosition);
          doc.text(transaction.transaction_type, 60, yPosition);
          doc.text(transaction.description || 'N/A', 100, yPosition);
          doc.text(amount, 150, yPosition);
          yPosition += 8;

          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }
    } else if (type === 'Monthly') {
      doc.setFontSize(16);
      doc.text('Monthly Summary', 20, yPosition);
      yPosition += 15;

      const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      doc.setFontSize(12);
      doc.text(`Month: ${currentMonth}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Monthly Contribution: ${formatCurrency(userData?.monthlyTotal || 0)}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Current Balance: ${formatCurrency(userData?.savingsBalance || 0)}`, 20, yPosition);
      yPosition += 20;

      // Add batch information if available
      if (userData?.batches && userData.batches.length > 0) {
        doc.setFontSize(14);
        doc.text('Active Batches', 20, yPosition);
        yPosition += 15;

        userData.batches.forEach((batch: any) => {
          doc.setFontSize(10);
          doc.text(`Batch: ${batch.name}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Monthly Contribution: ${formatCurrency(batch.monthly_contribution)}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Members: ${batch.current_members}/${batch.max_members}`, 20, yPosition);
          yPosition += 12;

          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }
    }

    // Save the PDF
    doc.save(`${type.toLowerCase()}-statement-${today.toISOString().split('T')[0]}.pdf`);
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
