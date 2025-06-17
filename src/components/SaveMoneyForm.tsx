
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, CreditCard, Smartphone } from 'lucide-react';
import { useSavings } from '@/hooks/useSavings';
import { toast } from 'sonner';
import MpesaPayment from './MpesaPayment';

interface SaveMoneyFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SaveMoneyForm = ({ onClose, onSuccess }: SaveMoneyFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'mpesa'>('manual');
  const [showMpesaPayment, setShowMpesaPayment] = useState(false);
  const { deposit, loading } = useSavings();

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await deposit(Number(amount), description || undefined);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving money:', error);
    }
  };

  const handleMpesaPayment = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setShowMpesaPayment(true);
  };

  const handleMpesaSuccess = async (transactionId: string) => {
    try {
      // Record the deposit with M-Pesa transaction reference
      await deposit(
        Number(amount), 
        `${description || 'M-Pesa deposit'} - Ref: ${transactionId}`
      );
      setShowMpesaPayment(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error recording M-Pesa deposit:', error);
      toast.error('Payment successful but failed to record deposit');
    }
  };

  if (showMpesaPayment) {
    return (
      <MpesaPayment
        amount={Number(amount)}
        purpose={`Save Money: ${description || 'Personal savings'}`}
        onClose={() => setShowMpesaPayment(false)}
        onSuccess={handleMpesaSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glassmorphism p-6 border-0 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Save Money</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleManualSave} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Amount (KES)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to save"
              className="bg-gray-800/50 border-gray-600 text-white"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              className="bg-gray-800/50 border-gray-600 text-white resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('manual')}
                className={`flex items-center gap-2 ${
                  paymentMethod === 'manual' 
                    ? 'gradient-primary text-white' 
                    : 'border-gray-600 text-gray-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Manual
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('mpesa')}
                className={`flex items-center gap-2 ${
                  paymentMethod === 'mpesa' 
                    ? 'gradient-primary text-white' 
                    : 'border-gray-600 text-gray-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                M-Pesa
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300"
              disabled={loading}
            >
              Cancel
            </Button>
            
            {paymentMethod === 'manual' ? (
              <Button
                type="submit"
                className="flex-1 gradient-primary text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Money'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleMpesaPayment}
                className="flex-1 gradient-primary text-white"
                disabled={!amount}
              >
                Pay with M-Pesa
              </Button>
            )}
          </div>
        </form>

        {paymentMethod === 'mpesa' && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-xs text-center">
              You'll receive an M-Pesa prompt on your phone to complete the payment
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SaveMoneyForm;
