
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon, Calculator, FileText, Users } from 'lucide-react';
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
    weeklyContribution: '',
    serviceFeePerMember: '100',
    maxMembers: '10',
    payoutStartDate: null as Date | null
  });
  
  const [calculations, setCalculations] = useState({
    totalOneTimePayment: 0,
    totalPooledAmount: 0,
    totalServiceFees: 0,
    weeklyPayout: 0
  });

  const { createBatch, loading } = useBatches();

  // Auto-calculate financial aspects when inputs change
  useEffect(() => {
    const weeklyContrib = Number(formData.weeklyContribution) || 0;
    const serviceFee = Number(formData.serviceFeePerMember) || 0;
    const members = Number(formData.maxMembers) || 0;

    if (weeklyContrib > 0 && members > 0) {
      const totalOneTimePayment = (weeklyContrib + serviceFee) * members;
      const totalPooledAmount = weeklyContrib * members * members; // Total over all weeks
      const totalServiceFees = serviceFee * members * members; // Service fees over all weeks
      const weeklyPayout = weeklyContrib * members;

      setCalculations({
        totalOneTimePayment,
        totalPooledAmount,
        totalServiceFees,
        weeklyPayout
      });
    } else {
      setCalculations({
        totalOneTimePayment: 0,
        totalPooledAmount: 0,
        totalServiceFees: 0,
        weeklyPayout: 0
      });
    }
  }, [formData.weeklyContribution, formData.serviceFeePerMember, formData.maxMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.weeklyContribution || !formData.payoutStartDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const maxMembersNum = Number(formData.maxMembers);
    if (maxMembersNum < 2 || maxMembersNum > 20) {
      toast.error('Maximum members must be between 2 and 20');
      return;
    }

    const weeklyContribNum = Number(formData.weeklyContribution);
    if (weeklyContribNum < 100) {
      toast.error('Weekly contribution must be at least KES 100');
      return;
    }

    try {
      await createBatch({
        name: formData.name,
        description: formData.description,
        weeklyContribution: weeklyContribNum,
        serviceFeePerMember: Number(formData.serviceFeePerMember),
        maxMembers: maxMembersNum,
        payoutStartDate: formData.payoutStartDate
      });
      
      toast.success('Batch created successfully! Merry-go-round will start automatically when full.');
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
                  placeholder="Brief description of your merry-go-round"
                  className="bg-gray-800/50 border-gray-600 text-white resize-none mt-1"
                  rows={2}
                />
              </div>

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
                  <Label className="text-gray-300 text-sm">Service Fee/Member/Week (KES) *</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm">Number of Members (2-20) *</Label>
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

                <div>
                  <Label className="text-gray-300 text-sm">Payout Start Date *</Label>
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
                  {loading ? 'Creating...' : 'Create TiM Batch'}
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
                <div className="flex justify-between">
                  <span className="text-gray-400">Total One-time Payment/Member:</span>
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
                
                <div className="flex justify-between border-t border-gray-600 pt-2">
                  <span className="text-gray-400">Total Service Fees (Organizer):</span>
                  <span className="text-cyan-400 font-semibold">
                    KES {calculations.totalServiceFees.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Schedule Preview */}
            {Number(formData.maxMembers) > 0 && calculations.weeklyPayout > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Payout Schedule Preview
                </h4>
                
                <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
                  {Array.from({ length: Number(formData.maxMembers) }, (_, i) => (
                    <div key={i} className="flex justify-between text-gray-300">
                      <span>Week {i + 1} - Member {i + 1}:</span>
                      <span className="text-green-400">KES {calculations.weeklyPayout.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/30">
              <h4 className="text-white font-semibold mb-2">TiM Chama Features</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Automatic payout schedule generation</li>
                <li>• Weekly contribution reminders</li>
                <li>• Legal agreement template</li>
                <li>• M-Pesa integration for payments</li>
                <li>• Default handling and penalties</li>
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
