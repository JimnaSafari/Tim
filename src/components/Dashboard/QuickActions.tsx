
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Plus } from 'lucide-react';

interface QuickActionsProps {
  onJoinBatch: () => void;
  onCreateBatch: () => void;
}

const QuickActions = ({ onJoinBatch, onCreateBatch }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card 
        className="glassmorphism-dark p-4 border-0 hover-lift transition-transform cursor-pointer stagger-item interactive-button"
        onClick={onJoinBatch}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse-glow">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Join Batch</p>
            <p className="text-gray-400 text-xs">Enter invite code</p>
          </div>
        </div>
      </Card>

      <Card 
        className="glassmorphism-dark p-4 border-0 hover-lift transition-transform cursor-pointer stagger-item interactive-button"
        onClick={onCreateBatch}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center animate-pulse-glow">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Create Batch</p>
            <p className="text-gray-400 text-xs">Start new group</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickActions;
