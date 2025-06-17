
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useReferrals = () => {
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const fetchReferralData = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      // Get user's referral code
      const { data: referralCodeData, error: codeError } = await supabase
        .from('user_referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (codeError && codeError.code !== 'PGRST116') {
        console.error('Error fetching referral code:', codeError);
      }

      // Get referral statistics
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
      }

      // Calculate stats
      const totalReferrals = referralsData?.length || 0;
      const completedReferrals = referralsData?.filter(r => r.status === 'completed' || r.status === 'rewarded').length || 0;
      const totalEarnings = referralsData?.filter(r => r.status === 'rewarded').reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0;

      setReferralData({
        referralCode: referralCodeData?.referral_code,
        totalReferrals,
        completedReferrals,
        totalEarnings,
        recentReferrals: referralsData?.slice(0, 5) || []
      });

    } catch (error: any) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [isAuthenticated, user]);

  const refreshReferralData = () => {
    setLoading(true);
    fetchReferralData();
  };

  return {
    referralData,
    loading,
    refreshReferralData
  };
};
