
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CreateBatchFormHeader from './CreateBatchForm/CreateBatchFormHeader';
import BatchTypeSelector from './CreateBatchForm/BatchTypeSelector';
import WeeklyBatchForm from './CreateBatchForm/WeeklyBatchForm';
import DailyBatchForm from './CreateBatchForm/DailyBatchForm';
import FinancialBreakdown from './CreateBatchForm/FinancialBreakdown';
import SchedulePreview from './CreateBatchForm/SchedulePreview';
import KeyFeatures from './CreateBatchForm/KeyFeatures';

interface CreateBatchFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBatchForm = ({ onClose, onSuccess }: CreateBatchFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    batchType: 'weekly' as 'weekly' | 'daily',
    weeklyContribution: '',
    oneTimeContribution: '',
    serviceFeePerMember: '100',
    maxMembers: '10',
    payoutStartDate: null as Date | null
  });
  
  const [calculations, setCalculations] = useState({
    totalOneTimePayment: 0,
    totalPooledAmount: 0,
    totalServiceFees: 0,
    weeklyPayout: 0,
    dailyPayout: 0,
    organizerEarnings: 0
  });

  const { createBatch, loading } = useBatches();

  // Auto-calculate financial aspects when inputs change
  useEffect(() => {
    const serviceFee = Number(formData.serviceFeePerMember) || 0;
    const members = Number(formData.maxMembers) || 0;

    if (formData.batchType === 'weekly') {
      const weeklyContrib = Number(formData.weeklyContribution) || 0;
      
      if (weeklyContrib > 0 && members > 0) {
        const totalOneTimePayment = (weeklyContrib + serviceFee) * members;
        const totalPooledAmount = weeklyContrib * members * members;
        const totalServiceFees = serviceFee * members * members;
        const weeklyPayout = weeklyContrib * members;
        const organizerEarnings = totalServiceFees;

        setCalculations({
          totalOneTimePayment,
          totalPooledAmount,
          totalServiceFees,
          weeklyPayout,
          dailyPayout: 0,
          organizerEarnings
        });
      } else {
        setCalculations({
          totalOneTimePayment: 0,
          totalPooledAmount: 0,
          totalServiceFees: 0,
          weeklyPayout: 0,
          dailyPayout: 0,
          organizerEarnings: 0
        });
      }
    } else {
      // Daily batch calculations
      const oneTimeContrib = Number(formData.oneTimeContribution) || 0;
      
      if (oneTimeContrib > 0 && members > 0) {
        const totalOneTimePayment = oneTimeContrib + serviceFee;
        const totalPooledAmount = oneTimeContrib * members;
        const totalServiceFees = serviceFee * members;
        const dailyPayout = oneTimeContrib * members;
        const organizerEarnings = totalServiceFees;

        setCalculations({
          totalOneTimePayment,
          totalPooledAmount,
          totalServiceFees,
          weeklyPayout: 0,
          dailyPayout,
          organizerEarnings
        });
      } else {
        setCalculations({
          totalOneTimePayment: 0,
          totalPooledAmount: 0,
          totalServiceFees: 0,
          weeklyPayout: 0,
          dailyPayout: 0,
          organizerEarnings: 0
        });
      }
    }
  }, [formData.weeklyContribution, formData.oneTimeContribution, formData.serviceFeePerMember, formData.maxMembers, formData.batchType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.payoutStartDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const maxMembersNum = Number(formData.maxMembers);
    if (maxMembersNum < 2 || maxMembersNum > 20) {
      toast.error('Maximum members must be between 2 and 20');
      return;
    }

    if (formData.batchType === 'weekly') {
      const weeklyContribNum = Number(formData.weeklyContribution);
      if (!weeklyContribNum || weeklyContribNum < 100) {
        toast.error('Weekly contribution must be at least KES 100');
        return;
      }
    } else {
      const oneTimeContribNum = Number(formData.oneTimeContribution);
      if (!oneTimeContribNum || oneTimeContribNum < 1000) {
        toast.error('One-time contribution must be at least KES 1,000');
        return;
      }

      if (maxMembersNum !== 10) {
        toast.error('Daily TiM Chama batches must have exactly 10 members');
        return;
      }
    }

    try {
      const batchData = {
        name: formData.name,
        description: formData.description,
        batchType: formData.batchType,
        maxMembers: maxMembersNum,
        serviceFeePerMember: Number(formData.serviceFeePerMember),
        payoutStartDate: formData.payoutStartDate,
        ...(formData.batchType === 'weekly' 
          ? { weeklyContribution: Number(formData.weeklyContribution) }
          : { oneTimeContribution: Number(formData.oneTimeContribution) }
        )
      };

      await createBatch(batchData);
      
      const successMessage = formData.batchType === 'weekly' 
        ? 'Weekly TiM Chama batch created successfully! Merry-go-round will start automatically when full.'
        : 'Daily TiM Chama batch created successfully! 10-day cycle will start automatically when full.';
      
      toast.success(successMessage);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating batch:', error);
      toast.error('Failed to create batch. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="glassmorphism p-6 border-0 w-full max-w-4xl my-8">
        <CreateBatchFormHeader onClose={onClose} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm">Batch Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Friends Circle TiM"
                  className="bg-gray-800/50 border-gray-600 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300 text-sm">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your chama"
                  className="bg-gray-800/50 border-gray-600 text-white resize-none mt-1"
                  rows={2}
                />
              </div>

              <BatchTypeSelector
                batchType={formData.batchType}
                onBatchTypeChange={(value) => setFormData({ ...formData, batchType: value })}
              />

              {formData.batchType === 'weekly' ? (
                <WeeklyBatchForm
                  weeklyContribution={formData.weeklyContribution}
                  maxMembers={formData.maxMembers}
                  onWeeklyContributionChange={(value) => setFormData({ ...formData, weeklyContribution: value })}
                  onMaxMembersChange={(value) => setFormData({ ...formData, maxMembers: value })}
                />
              ) : (
                <DailyBatchForm
                  oneTimeContribution={formData.oneTimeContribution}
                  onOneTimeContributionChange={(value) => setFormData({ ...formData, oneTimeContribution: value })}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm">Service Fee/Member (KES) *</Label>
                  <Input
                    type="number"
                    value={formData.serviceFeePerMember}
                    onChange={(e) => setFormData({ ...formData, serviceFeePerMember: e.target.value })}
                    placeholder="100"
                    className="bg-gray-800/50 border-gray-600 text-white mt-1"
                    required
                    min="50"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">
                    {formData.batchType === 'weekly' ? 'Payout Start Date *' : 'Day 1 Start Date *'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1 bg-gray-800/50 border-gray-600 text-white",
                          !formData.payoutStartDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.payoutStartDate ? format(formData.payoutStartDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                      <Calendar
                        mode="single"
                        selected={formData.payoutStartDate}
                        onSelect={(date) => setFormData({ ...formData, payoutStartDate: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
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
                <Button
                  type="submit"
                  className="flex-1 gradient-primary text-white"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : `Create ${formData.batchType === 'weekly' ? 'Weekly' : 'Daily'} TiM Batch`}
                </Button>
              </div>
            </form>
          </div>

          {/* Calculations Section */}
          <div className="space-y-4">
            <FinancialBreakdown batchType={formData.batchType} calculations={calculations} />

            <SchedulePreview
              batchType={formData.batchType}
              maxMembers={Number(formData.maxMembers)}
              weeklyPayout={calculations.weeklyPayout}
              dailyPayout={calculations.dailyPayout}
            />

            <KeyFeatures batchType={formData.batchType} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBatchForm;
