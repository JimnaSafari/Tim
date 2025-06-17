
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { mpesaService, STKPushRequest } from '@/services/mpesaService';
import { toast } from 'sonner';
import PaymentSplitInfo from './PaymentSplitInfo';

interface MpesaPaymentProps {
  amount: number;
  purpose: string;
  batchId?: string;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

const MpesaPayment = ({ amount, purpose, batchId, onClose, onSuccess }: MpesaPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    
    // If starts with +254, remove the +
    if (cleaned.startsWith('254')) {
      return cleaned;
    }
    
    // If starts with 7, add 254
    if (cleaned.startsWith('7')) {
      return '254' + cleaned;
    }
    
    return cleaned;
  };

  const handleSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    const request: STKPushRequest = {
      amount,
      phoneNumber: formatPhoneNumber(phoneNumber),
      accountReference: batchId ? `BATCH-${batchId}` : `SAV-${Date.now()}`,
      transactionDesc: purpose,
      batchId
    };

    try {
      const response = await mpesaService.initiateSTKPush(request);
      
      if (response.success && response.checkoutRequestId) {
        setCheckoutRequestId(response.checkoutRequestId);
        toast.success('Payment request sent to your phone');
        
        // Start checking payment status
        checkPaymentStatus(response.checkoutRequestId);
      } else {
        toast.error(response.errorMessage || 'Failed to initiate payment');
      }
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (requestId: string) => {
    setPaymentStatus('checking');
    
    // Poll for payment status every 5 seconds for up to 2 minutes
    const maxAttempts = 24; // 2 minutes / 5 seconds
    let attempts = 0;
    
    const pollStatus = async () => {
      try {
        const status = await mpesaService.checkPaymentStatus(requestId);
        
        if (status.resultCode === '0') {
          // Payment successful
          setPaymentStatus('success');
          toast.success('Payment successful!');
          onSuccess(status.transactionId);
          return;
        } else if (status.resultCode && status.resultCode !== '1032') {
          // Payment failed (not pending)
          setPaymentStatus('failed');
          toast.error('Payment failed or was cancelled');
          return;
        }
        
        // Still pending, continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 5000);
        } else {
          setPaymentStatus('failed');
          toast.error('Payment timeout. Please try again.');
        }
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 5000);
        } else {
          setPaymentStatus('failed');
          toast.error('Unable to verify payment status');
        }
      }
    };
    
    // Start polling after 3 seconds
    setTimeout(pollStatus, 3000);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      default:
        return <Smartphone className="w-8 h-8 text-green-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'checking':
        return 'Waiting for payment confirmation...';
      case 'success':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed or was cancelled';
      default:
        return 'Enter your M-Pesa number to pay';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">M-Pesa Payment</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            disabled={paymentStatus === 'checking'}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          {getStatusIcon()}
          <h4 className="text-xl font-bold text-white mt-4">
            KES {amount.toLocaleString()}
          </h4>
          <p className="text-gray-400 text-sm mt-2">{purpose}</p>
          <p className="text-gray-300 text-sm mt-2">{getStatusMessage()}</p>
        </div>

        {/* Show payment split info for batch contributions */}
        {batchId && checkoutRequestId && (
          <div className="mb-4">
            <PaymentSplitInfo 
              checkoutRequestId={checkoutRequestId} 
              totalAmount={amount} 
            />
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">M-Pesa Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712345678"
                className="bg-gray-800/50 border-gray-600 text-white"
                maxLength={13}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Safaricom number
              </p>
            </div>

            <Button
              onClick={handleSTKPush}
              className="w-full gradient-primary text-white"
              disabled={loading || !phoneNumber}
            >
              {loading ? 'Sending...' : 'Pay with M-Pesa'}
            </Button>
          </div>
        )}

        {paymentStatus === 'checking' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm text-center">
              Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <Button
            onClick={onClose}
            className="w-full gradient-primary text-white"
          >
            Done
          </Button>
        )}

        {paymentStatus === 'failed' && (
          <div className="space-y-3">
            <Button
              onClick={() => {
                setPaymentStatus('pending');
                setCheckoutRequestId(null);
              }}
              className="w-full gradient-primary text-white"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MpesaPayment;
