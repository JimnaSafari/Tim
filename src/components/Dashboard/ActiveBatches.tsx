
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  current_members: number;
  max_members: number;
  status: string;
  monthly_contribution: number;
  invite_code: string;
}

interface ActiveBatchesProps {
  batches?: Batch[];
  onCreateBatch: () => void;
  onJoinBatch: () => void;
}

const ActiveBatches = ({ batches, onCreateBatch, onJoinBatch }: ActiveBatchesProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Your Batches</h3>
      {batches && batches.length > 0 ? (
        <div className="space-y-4">
          {batches.slice(0, 2).map((batch: Batch, index: number) => (
            <Card key={batch.id} className="glassmorphism p-4 border-0 relative overflow-hidden hover-lift stagger-item">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-lg animate-float"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{batch.name}</h4>
                    <p className="text-sm text-gray-400">
                      {batch.current_members}/{batch.max_members} members
                    </p>
                  </div>
                  <span className={`${
                    batch.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  } text-xs px-3 py-1 rounded-full border animate-pulse-glow`}>
                    {batch.status === 'recruiting' ? 'Recruiting' : 'Active'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm mb-3">
                  <div className="animate-slide-up">
                    <p className="text-gray-400">Monthly</p>
                    <p className="text-white font-medium">KES {Number(batch.monthly_contribution).toLocaleString()}</p>
                  </div>
                  <div className="text-right animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-gray-400">Code</p>
                    <p className="text-white font-medium font-mono">{batch.invite_code}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full progress-bar" 
                    style={{ width: `${(batch.current_members / batch.max_members) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glassmorphism-dark p-6 border-0 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">No Batches Yet</h4>
          <p className="text-gray-400 mb-4">Create your first batch or join an existing one</p>
          <div className="flex gap-3 justify-center">
            <Button 
              className="gradient-primary text-white"
              onClick={onCreateBatch}
            >
              Create Batch
            </Button>
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300"
              onClick={onJoinBatch}
            >
              Join Batch
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActiveBatches;
