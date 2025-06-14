
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBatches = () => {
  const [loading, setLoading] = useState(false);

  const createBatch = async (batchData: {
    name: string;
    description?: string;
    weeklyContribution: number;
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

      toast.success('TiM Chama batch created successfully!');
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

  return {
    createBatch,
    joinBatch,
    generateAgreement,
    loading
  };
};
