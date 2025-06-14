
export interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  batchId?: string;
}

export interface STKPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  errorMessage?: string;
}

export interface PaymentSplit {
  serviceFee: number;
  poolContribution: number;
  destination: {
    serviceFee: string;
    poolMoney: string;
    poolType: 'mpesa' | 'bank';
  };
}

export const mpesaService = {
  async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to make payments');
      }

      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: request,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      // If this is a batch contribution, process payment splits
      if (request.batchId && data.success && data.checkoutRequestId) {
        console.log('Processing payment splits for batch contribution...');
        
        // Calculate splits (service fee is typically 100 KES per member)
        const serviceFeeAmount = 100;
        const poolAmount = request.amount - serviceFeeAmount;
        
        // Process payment splits
        const { error: splitsError } = await supabase.functions.invoke('process-payment-splits', {
          body: {
            transactionId: data.checkoutRequestId,
            totalAmount: request.amount,
            serviceFeeAmount,
            poolAmount
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (splitsError) {
          console.error('Failed to process payment splits:', splitsError);
        }
      }

      return data;
    } catch (error: any) {
      console.error('STK Push error:', error);
      return {
        success: false,
        errorMessage: error.message || 'Failed to initiate payment'
      };
    }
  },

  async checkPaymentStatus(checkoutRequestId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to check payment status');
      }

      const { data, error } = await supabase.functions.invoke('mpesa-payment-status', {
        body: { checkoutRequestId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Payment status check error:', error);
      throw error;
    }
  },

  async getPaymentSplits(checkoutRequestId: string): Promise<PaymentSplit | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to view payment splits');
      }

      const { data: splits, error } = await supabase
        .from('payment_splits')
        .select('*')
        .eq('original_transaction_id', checkoutRequestId);

      if (error) throw error;

      if (!splits || splits.length === 0) {
        return null;
      }

      const serviceFeeplit = splits.find(s => s.split_type === 'service_fee');
      const poolSplit = splits.find(s => s.split_type === 'pool_contribution');

      if (!serviceFeeplit || !poolSplit) {
        return null;
      }

      return {
        serviceFee: serviceFeeplit.amount,
        poolContribution: poolSplit.amount,
        destination: {
          serviceFee: serviceFeeplit.destination_identifier,
          poolMoney: poolSplit.destination_identifier,
          poolType: poolSplit.destination_type as 'mpesa' | 'bank'
        }
      };
    } catch (error: any) {
      console.error('Error fetching payment splits:', error);
      return null;
    }
  }
};

// Import supabase at the top
import { supabase } from '@/integrations/supabase/client';
