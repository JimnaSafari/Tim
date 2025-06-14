
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSavings = () => {
  const [loading, setLoading] = useState(false);

  const deposit = async (amount: number, description?: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to make a deposit');
      }

      const { data, error } = await supabase.functions.invoke('manage-savings', {
        body: { 
          action: 'deposit',
          amount,
          description 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast.success(`Successfully deposited KES ${amount}`);
      return data;
    } catch (error: any) {
      console.error('Error making deposit:', error);
      toast.error(error.message || 'Failed to make deposit');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: number, description?: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to make a withdrawal');
      }

      const { data, error } = await supabase.functions.invoke('manage-savings', {
        body: { 
          action: 'withdrawal',
          amount,
          description 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast.success(`Successfully withdrew KES ${amount}`);
      return data;
    } catch (error: any) {
      console.error('Error making withdrawal:', error);
      toast.error(error.message || 'Failed to make withdrawal');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deposit,
    withdraw,
    loading
  };
};
