
import React from 'react';
import { Card } from '@/components/ui/card';

const ProfileStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="glassmorphism-dark p-4 border-0 text-center">
        <div className="text-2xl font-bold text-cyan-400 mb-1">3</div>
        <div className="text-xs text-gray-400">Active Batches</div>
      </Card>
      <Card className="glassmorphism-dark p-4 border-0 text-center">
        <div className="text-2xl font-bold text-green-400 mb-1">12</div>
        <div className="text-xs text-gray-400">Payouts</div>
      </Card>
      <Card className="glassmorphism-dark p-4 border-0 text-center">
        <div className="text-2xl font-bold text-purple-400 mb-1">98%</div>
        <div className="text-xs text-gray-400">Success Rate</div>
      </Card>
    </div>
  );
};

export default ProfileStats;
