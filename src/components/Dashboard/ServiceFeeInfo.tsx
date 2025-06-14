
import React from 'react';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

const ServiceFeeInfo = () => {
  return (
    <Card className="glassmorphism-dark p-4 mb-6 border-0 stagger-item animate-pulse-glow">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 animate-float">
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium text-white mb-1">Contribution Breakdown</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Total contribution: <span className="text-white font-medium">KES 1,100</span></p>
            <p>• Group pool: <span className="text-green-400">KES 1,000</span></p>
            <p>• Service fee: <span className="text-blue-400">KES 100</span></p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceFeeInfo;
