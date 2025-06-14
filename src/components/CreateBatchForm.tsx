
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar as CalendarIcon, Calculator, FileText, Users, Clock } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create New TiM Chama Batch
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

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

              <div>
                <Label className="text-gray-300 text-sm">Batch Type *</Label>
                <Select value={formData.batchType} onValueChange={(value: 'weekly' | 'daily') => setFormData({ ...formData, batchType: value })}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Select batch type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="weekly" className="text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Weekly Contributions
                      </div>
                    </SelectItem>
                    <SelectItem value="daily" className="text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Daily Payouts (10-Day)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.batchType === 'weekly' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Weekly Contribution (KES) *</Label>
                    <Input
                      type="number"
                      value={formData.weeklyContribution}
                      onChange={(e) => setFormData({ ...formData, weeklyContribution: e.target.value })}
                      placeholder="1000"
                      className="bg-gray-800/50 border-gray-600 text-white mt-1"
                      required
                      min="100"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Members (2-20) *</Label>
                    <Input
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                      placeholder="10"
                      className="bg-gray-800/50 border-gray-600 text-white mt-1"
                      required
                      min="2"
                      max="20"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm">One-Time Contribution (KES) *</Label>
                    <Input
                      type="number"
                      value={formData.oneTimeContribution}
                      onChange={(e) => setFormData({ ...formData, oneTimeContribution: e.target.value })}
                      placeholder="10000"
                      className="bg-gray-800/50 border-gray-600 text-white mt-1"
                      required
                      min="1000"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Members (Fixed: 10)</Label>
                    <Input
                      type="number"
                      value="10"
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-400 mt-1"
                    />
                  </div>
                </div>
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
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Financial Breakdown
              </h4>
              
              <div className="space-y-3 text-sm">
                {formData.batchType === 'weekly' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Payment/Member/Week:</span>
                      <span className="text-green-400 font-semibold">
                        KES {calculations.totalOneTimePayment.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weekly Payout Amount:</span>
                      <span className="text-blue-400 font-semibold">
                        KES {calculations.weeklyPayout.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Pooled Amount:</span>
                      <span className="text-purple-400 font-semibold">
                        KES {calculations.totalPooledAmount.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">One-Time Payment/Member:</span>
                      <span className="text-green-400 font-semibold">
                        KES {calculations.totalOneTimePayment.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Payout Amount:</span>
                      <span className="text-blue-400 font-semibold">
                        KES {calculations.dailyPayout.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Pool (10 Days):</span>
                      <span className="text-purple-400 font-semibold">
                        KES {calculations.totalPooledAmount.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between border-t border-gray-600 pt-2">
                  <span className="text-gray-400">Organizer Earnings:</span>
                  <span className="text-cyan-400 font-semibold">
                    KES {calculations.organizerEarnings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Preview */}
            {Number(formData.maxMembers) > 0 && (formData.batchType === 'weekly' ? calculations.weeklyPayout : calculations.dailyPayout) > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {formData.batchType === 'weekly' ? 'Payout Schedule Preview' : 'Daily Payout Schedule'}
                </h4>
                
                <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
                  {Array.from({ length: Number(formData.maxMembers) }, (_, i) => (
                    <div key={i} className="flex justify-between text-gray-300">
                      <span>
                        {formData.batchType === 'weekly' ? `Week ${i + 1}` : `Day ${i + 1}`} - Member {i + 1}:
                      </span>
                      <span className="text-green-400">
                        KES {(formData.batchType === 'weekly' ? calculations.weeklyPayout : calculations.dailyPayout).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/30">
              <h4 className="text-white font-semibold mb-2">
                {formData.batchType === 'weekly' ? 'Weekly TiM Chama Features' : 'Daily TiM Chama Features'}
              </h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {formData.batchType === 'weekly' ? (
                  <>
                    <li>• Weekly contribution schedule</li>
                    <li>• Automatic payout generation</li>
                    <li>• Weekly contribution reminders</li>
                    <li>• Flexible member count (2-20)</li>
                  </>
                ) : (
                  <>
                    <li>• One-time contribution only</li>
                    <li>• Daily payouts for 10 days</li>
                    <li>• Fixed 10-member groups</li>
                    <li>• No recurring payments needed</li>
                  </>
                )}
                <li>• Legal agreement template</li>
                <li>• M-Pesa integration for payments</li>
                <li>• Transparent financial tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBatchForm;
