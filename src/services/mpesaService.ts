
export interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface STKPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  errorMessage?: string;
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
  }
};

// Import supabase at the top
import { supabase } from '@/integrations/supabase/client';
