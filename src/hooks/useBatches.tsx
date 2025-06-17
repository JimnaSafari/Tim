
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBatches = () => {
  const [loading, setLoading] = useState(false);

  const createBatch = async (batchData: {
    name: string;
    description?: string;
    batchType: 'weekly' | 'daily';
    weeklyContribution?: number;
    oneTimeContribution?: number;
    serviceFeePerMember: number;
    maxMembers: number;
    payoutStartDate: Date;
  }) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to create a batch');
      }

      const { data, error } = await supabase.functions.invoke('create-tim-batch', {
        body: batchData,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      const successMessage = batchData.batchType === 'weekly' 
        ? 'Weekly TiM Chama batch created successfully!'
        : 'Daily TiM Chama batch created successfully!';
      
      toast.success(successMessage);
      return data;
    } catch (error: any) {
      console.error('Error creating batch:', error);
      toast.error(error.message || 'Failed to create batch');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinBatch = async (inviteCode: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to join a batch');
      }

      const { data, error } = await supabase.functions.invoke('join-batch', {
        body: { inviteCode },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast.success('Successfully joined the TiM Chama batch!');
      return data;
    } catch (error: any) {
      console.error('Error joining batch:', error);
      toast.error(error.message || 'Failed to join batch');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateAgreement = async (batchId: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to generate agreement');
      }

      const { data, error } = await supabase.functions.invoke('generate-tim-agreement', {
        body: { batchId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error generating agreement:', error);
      toast.error(error.message || 'Failed to generate agreement');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContributionStatus = async (contributionId: string, status: 'pending' | 'paid' | 'overdue') => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to update contribution status');
      }

      // First get the contribution to access the amount_due
      const { data: contribution, error: fetchError } = await supabase
        .from('weekly_contributions')
        .select('amount_due')
        .eq('id', contributionId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('weekly_contributions')
        .update({ 
          status, 
          payment_date: status === 'paid' ? new Date().toISOString() : null,
          amount_paid: status === 'paid' ? contribution.amount_due : 0
        })
        .eq('id', contributionId);

      if (error) throw error;

      toast.success('Contribution status updated successfully');
    } catch (error: any) {
      console.error('Error updating contribution status:', error);
      toast.error(error.message || 'Failed to update contribution status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOneTimeContributionStatus = async (contributionId: string, status: 'pending' | 'paid' | 'overdue') => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to update contribution status');
      }

      // First get the contribution to access the amount_due
      const { data: contribution, error: fetchError } = await supabase
        .from('one_time_contributions')
        .select('amount_due')
        .eq('id', contributionId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('one_time_contributions')
        .update({ 
          status, 
          payment_date: status === 'paid' ? new Date().toISOString() : null,
          amount_paid: status === 'paid' ? contribution.amount_due : 0
        })
        .eq('id', contributionId);

      if (error) throw error;

      toast.success('Contribution status updated successfully');
    } catch (error: any) {
      console.error('Error updating contribution status:', error);
      toast.error(error.message || 'Failed to update contribution status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markPayoutAsPaid = async (payoutId: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to mark payout as paid');
      }

      const { error } = await supabase
        .from('payout_schedules')
        .update({ 
          is_paid: true,
          payment_date: new Date().toISOString()
        })
        .eq('id', payoutId);

      if (error) throw error;

      toast.success('Payout marked as paid successfully');
    } catch (error: any) {
      console.error('Error marking payout as paid:', error);
      toast.error(error.message || 'Failed to mark payout as paid');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const makeBatchContribution = async (batchId: string, amount: number, phoneNumber: string, description: string) => {
    setLoading(true);
    try {
      const { mpesaService } = await import('@/services/mpesaService');
      
      const response = await mpesaService.initiateSTKPush({
        amount,
        phoneNumber,
        accountReference: `BATCH-${batchId}`,
        transactionDesc: description,
        batchId // This will trigger payment splits
      });

      if (response.success) {
        toast.success('Payment request sent! Check your phone for M-Pesa prompt.');
      } else {
        toast.error(response.errorMessage || 'Failed to initiate payment');
      }

      return response;
    } catch (error: any) {
      console.error('Error making batch contribution:', error);
      toast.error(error.message || 'Failed to make contribution');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBatch,
    joinBatch,
    generateAgreement,
    updateContributionStatus,
    updateOneTimeContributionStatus,
    markPayoutAsPaid,
    makeBatchContribution,
    loading
  };
};
