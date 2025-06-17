
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share, Copy, Gift, Users, Award } from 'lucide-react';
import { useReferrals } from '@/hooks/useReferrals';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Referrals = () => {
  const { referralData, loading } = useReferrals();
  const navigate = useNavigate();
  const [copyLoading, setCopyLoading] = useState(false);

  const handleCopyReferralCode = async () => {
    if (!referralData?.referralCode) return;
    
    setCopyLoading(true);
    try {
      await navigator.clipboard.writeText(referralData.referralCode);
      toast.success('Referral code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy referral code');
    } finally {
      setCopyLoading(false);
    }
  };

  const handleShareReferral = async () => {
    if (!referralData?.referralCode) return;
    
    const shareText = `Join me on this amazing savings platform! Use my referral code: ${referralData.referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Savings Group',
          text: shareText,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopyReferralCode();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading referrals...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-xl font-medium">Referral Program</h1>
        <Button variant="ghost" size="sm" className="text-white p-2" aria-label="Share">
          <Share className="w-5 h-5" />
        </Button>
      </div>

      {/* Referral Code Card */}
      <Card className="glassmorphism p-6 mb-6 border-0 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your Referral Code</h2>
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-2xl font-bold text-cyan-400 tracking-wider">
              {referralData?.referralCode || 'Loading...'}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleCopyReferralCode}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={copyLoading || !referralData?.referralCode}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copyLoading ? 'Copying...' : 'Copy Code'}
            </Button>
            <Button
              onClick={handleShareReferral}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white"
              disabled={!referralData?.referralCode}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {referralData?.totalReferrals || 0}
          </div>
          <div className="text-xs text-gray-400">Total Referrals</div>
        </Card>
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {referralData?.completedReferrals || 0}
          </div>
          <div className="text-xs text-gray-400">Completed</div>
        </Card>
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            KES {referralData?.totalEarnings || 0}
          </div>
          <div className="text-xs text-gray-400">Earned</div>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="glassmorphism p-6 mb-6 border-0">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-400" />
          How Referrals Work
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
              1
            </div>
            <div>
              <p className="text-white font-medium">Share your code</p>
              <p className="text-gray-400 text-sm">Send your referral code to friends and family</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
              2
            </div>
            <div>
              <p className="text-white font-medium">They sign up</p>
              <p className="text-gray-400 text-sm">Your friend joins using your referral code</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
              3
            </div>
            <div>
              <p className="text-white font-medium">Earn rewards</p>
              <p className="text-gray-400 text-sm">Both you and your friend earn KES 100 bonus!</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Referrals */}
      <Card className="glassmorphism p-6 border-0">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          Recent Referrals
        </h3>
        {referralData?.recentReferrals && referralData.recentReferrals.length > 0 ? (
          <div className="space-y-3">
            {referralData.recentReferrals.map((referral: any) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New Referral</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  referral.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : referral.status === 'rewarded'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {referral.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No referrals yet</p>
            <p className="text-sm">Start sharing your code to earn rewards!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Referrals;
