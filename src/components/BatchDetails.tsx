
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Clock, FileText, X, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BatchAgreement from './BatchAgreement';

interface BatchDetailsProps {
  batch: any;
  onClose: () => void;
}

const BatchDetails = ({ batch, onClose }: BatchDetailsProps) => {
  const [payoutSchedule, setPayoutSchedule] = useState<any[]>([]);
  const [weeklyContributions, setWeeklyContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    fetchBatchDetails();
  }, [batch.id]);

  const fetchBatchDetails = async () => {
    try {
      // Fetch payout schedule
      const { data: payoutData, error: payoutError } = await supabase
        .from('payout_schedules')
        .select(`
          *,
          profiles:member_id (
            full_name
          )
        `)
        .eq('batch_id', batch.id)
        .order('week_number');

      if (payoutError) {
        console.error('Error fetching payout schedule:', payoutError);
      } else {
        setPayoutSchedule(payoutData || []);
      }

      // Fetch weekly contributions for current week
      const { data: contributionsData, error: contributionsError } = await supabase
        .from('weekly_contributions')
        .select(`
          *,
          profiles:member_id (
            full_name
          )
        `)
        .eq('batch_id', batch.id)
        .order('week_number, member_id');

      if (contributionsError) {
        console.error('Error fetching contributions:', contributionsError);
      } else {
        setWeeklyContributions(contributionsData || []);
      }
    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast.error('Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'recruiting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  // Use actual batch data or fallback to mock data
  const currentWeek = batch.current_week || 1;
  const weeklyContribution = batch.weekly_contribution || batch.monthly_contribution || 1000;
  const serviceFee = batch.service_fee_per_member || 100;
  const totalWeeklyPayment = weeklyContribution + serviceFee;
  const totalPayout = weeklyContribution * batch.max_members;

  // Use actual payout schedule or generate mock if empty
  const displayPayoutSchedule = payoutSchedule.length > 0 ? payoutSchedule : 
    batch.batch_members?.map((member: any, index: number) => ({
      week_number: index + 1,
      member_name: member.profiles?.full_name || `Member ${index + 1}`,
      payout_amount: totalPayout,
      payout_date: new Date(Date.now() + (index * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      is_paid: false
    })) || [];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="glassmorphism p-6 border-0 w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{batch.name}</h3>
            <Badge className={`${getStatusColor(batch.status)} border animate-pulse-glow`}>
              {batch.status}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Batch Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Members</p>
                <p className="text-white font-semibold">{batch.current_members}/{batch.max_members}</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Weekly Payment</p>
                <p className="text-white font-semibold">KES {totalWeeklyPayment.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Current Week</p>
                <p className="text-white font-semibold">{currentWeek} of {batch.total_weeks || batch.max_members}</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism-dark p-4 border-0">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-sm">Weekly Payout</p>
                <p className="text-white font-semibold">KES {totalPayout.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Breakdown */}
        <Card className="glassmorphism-dark p-4 mb-6 border-0">
          <h4 className="text-lg font-semibold text-white mb-3">Financial Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Weekly Contribution</p>
              <p className="text-green-400 font-semibold">KES {weeklyContribution.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Service Fee</p>
              <p className="text-blue-400 font-semibold">KES {serviceFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Weekly Payment</p>
              <p className="text-white font-semibold">KES {totalWeeklyPayment.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setShowAgreement(true)}
            className="gradient-primary text-white flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Agreement
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            Manage Members
          </Button>
        </div>

        {/* Payout Schedule */}
        <Card className="glassmorphism-dark p-4 mb-6 border-0">
          <h4 className="text-lg font-semibold text-white mb-3">Payout Schedule</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {displayPayoutSchedule.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    payout.week_number === currentWeek ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {payout.week_number}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {payout.profiles?.full_name || payout.member_name || `Member ${index + 1}`}
                    </p>
                    <p className="text-gray-400 text-sm">{payout.payout_date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">KES {payout.payout_amount.toLocaleString()}</p>
                  <Badge className={payout.is_paid ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                    {payout.is_paid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Contributions Status */}
        {weeklyContributions.length > 0 && (
          <Card className="glassmorphism-dark p-4 mb-6 border-0">
            <h4 className="text-lg font-semibold text-white mb-3">Current Week Contributions</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {weeklyContributions
                .filter(contrib => contrib.week_number === currentWeek)
                .map((contribution, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {contribution.profiles?.full_name || `Member ${index + 1}`}
                    </p>
                    <p className="text-gray-400 text-xs">Week {contribution.week_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">KES {contribution.amount_due.toLocaleString()}</p>
                    <Badge className={`text-xs ${
                      contribution.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      contribution.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {contribution.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Members List */}
        <Card className="glassmorphism-dark p-4 border-0">
          <h4 className="text-lg font-semibold text-white mb-3">Members</h4>
          <div className="space-y-2">
            {batch.batch_members?.map((member: any, index: number) => (
              <div key={member.user_id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {(member.profiles?.full_name || `M${index + 1}`)[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.profiles?.full_name || `Member ${index + 1}`}</p>
                    <p className="text-gray-400 text-sm">Position {index + 1}</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400">
                  Week {index + 1} Payout
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Agreement Modal */}
        {showAgreement && (
          <BatchAgreement
            batchId={batch.id}
            batchName={batch.name}
            onClose={() => setShowAgreement(false)}
          />
        )}
      </Card>
    </div>
  );
};

export default BatchDetails;
