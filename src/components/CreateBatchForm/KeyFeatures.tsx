
import React from 'react';

interface KeyFeaturesProps {
  batchType: 'weekly' | 'daily';
}

const KeyFeatures = ({ batchType }: KeyFeaturesProps) => {
  return (
    <div className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10 rounded-lg p-4 border border-cyan-400/30">
      <h4 className="text-white font-semibold mb-2">
        {batchType === 'weekly' ? 'Weekly TiM Chama Features' : 'Daily TiM Chama Features'}
      </h4>
      <ul className="text-xs text-gray-300 space-y-1">
        {batchType === 'weekly' ? (
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
  );
};

export default KeyFeatures;
