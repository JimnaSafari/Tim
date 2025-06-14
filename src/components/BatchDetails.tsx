
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BatchAgreement from './BatchAgreement';

interface BatchDetailsProps {
  batchId: string;
  onBack: () => void;
}

const BatchDetails = ({ batchId, onBack }: BatchDetailsProps) => {
  const [batch, setBatch] = useState<any>(null);
  const [payoutSchedule, setPayoutSchedule] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch batch details with members
      const { data: batchData, error: batchError } = await supabase
        .from('batches')
        .select(`
          *,
          batch_members (
            user_id,
            position,
            joined_at,
            profiles (
              full_name,
              phone_number
            )
          )
        `)
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;
      setBatch(batchData);

      // Fetch payout schedule
      const { data: payoutData, error: payoutError } = await supabase
        .from('payout_schedules')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('batch_id', batchId)
        .order('week_number');

      if (payoutError) throw payoutError;
      setPayoutSchedule(payoutData || []);

      // Fetch weekly contributions for current week
      const currentWeek = batchData?.current_week || 1;
      const { data: contributionData, error: contributionError } = await supabase
        .from('weekly_contributions')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('batch_id', batchId)
        .eq('week_number', currentWeek);

      if (contributionError) throw contributionError;
      setContributions(contributionData || []);

    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast.error('Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (batch?.invite_code) {
      navigator.clipboard.writeText(batch.invite_code);
      toast.success('Invite code copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
          <p className="text-gray-400 mb-4">The requested batch could not be found.</p>
          <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentWeekPayout = payoutSchedule.find(p => p.week_number === batch.current_week);
  const totalContribution = batch.weekly_contribution + batch.service_fee_per_member;
  const weeklyPayout = batch.weekly_contribution * batch.max_members;

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-12">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">Batch Details</h1>
        <div className="w-10"></div>
      </div>

      {/* Batch Info Card */}
      <Card className="glassmorphism p-6 mb-6 border-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{batch.name}</h2>
              <p className="text-gray-400">{batch.description}</p>
            </div>
            <Badge className={`${
              batch.status === 'active' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {batch.status === 'recruiting' ? 'Recruiting' : 'Active'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Weekly Contribution</p>
              <p className="text-white font-semibold">KES {batch.weekly_contribution?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Service Fee</p>
              <p className="text-white font-semibold">KES {batch.service_fee_per_member?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Weekly Payout</p>
              <p className="text-white font-semibold">KES {weeklyPayout.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Week</p>
              <p className="text-white font-semibold">{batch.current_week || 0} of {batch.max_members}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Members</span>
              <span className="text-sm font-medium text-white">
                {batch.current_members} of {batch.max_members}
              </span>
            </div>
            <Progress 
              value={(batch.current_members / batch.max_members) * 100} 
              className="h-2 bg-gray-700"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Invite Code:</span>
              <code className="bg-gray-800 px-2 py-1 rounded text-cyan-400 font-mono">
                {batch.invite_code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyInviteCode}
                className="p-1 h-auto text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Week Status */}
      {batch.status === 'active' && currentWeekPayout && (
        <Card className="glassmorphism-dark p-4 mb-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Week {batch.current_week} Payout</h3>
              <p className="text-gray-400">
                {currentWeekPayout.profiles?.full_name} receives KES {currentWeekPayout.payout_amount?.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <Badge className={currentWeekPayout.is_paid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                {currentWeekPayout.is_paid ? 'Paid' : 'Pending'}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(currentWeekPayout.payout_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Members List */}
      <Card className="glassmorphism-dark p-4 mb-6 border-0">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members ({batch.batch_members?.length || 0})
        </h3>
        <div className="space-y-3">
          {batch.batch_members?.map((member: any, index: number) => (
            <div key={member.user_id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {member.position}
                </div>
                <div>
                  <p className="text-white font-medium">{member.profiles?.full_name || `Member ${index + 1}`}</p>
                  <p className="text-gray-400 text-sm">Position {member.position}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Joined</p>
                <p className="text-white text-sm">{new Date(member.joined_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payout Schedule */}
      {payoutSchedule.length > 0 && (
        <Card className="glassmorphism-dark p-4 mb-6 border-0">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Payout Schedule
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payoutSchedule.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    payout.is_paid ? 'bg-green-500' : 
                    payout.week_number === batch.current_week ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}>
                    {payout.is_paid ? <CheckCircle className="w-4 h-4 text-white" /> : 
                     <Clock className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">Week {payout.week_number}</p>
                    <p className="text-gray-400 text-sm">{payout.profiles?.full_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">KES {payout.payout_amount?.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{new Date(payout.payout_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setShowAgreement(true)}
          className="glassmorphism-dark border-gray-600 text-white flex items-center gap-2"
          variant="outline"
        >
          <FileText className="w-4 h-4" />
          View Agreement
        </Button>
        <Button
          className="gradient-primary text-white flex items-center gap-2"
          disabled
        >
          <Bell className="w-4 h-4" />
          Send Reminders
        </Button>
      </div>

      {/* Agreement Modal */}
      {showAgreement && (
        <BatchAgreement
          batchId={batchId}
          batchName={batch.name}
          onClose={() => setShowAgreement(false)}
        />
      )}
    </div>
  );
};

export default BatchDetails;
