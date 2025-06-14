
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, John</h1>
          <p className="text-gray-600">Welcome back to TIM</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
          JD
        </div>
      </div>

      {/* Balance Card */}
      <Card className="gradient-primary p-6 mb-6 text-white border-0 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <h2 className="text-3xl font-bold">KES 12,500</h2>
          </div>
          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Plus className="w-4 h-4 mr-1" />
            Add Money
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-blue-100 text-xs">Available</p>
            <p className="text-lg font-semibold">KES 8,500</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs">Savings</p>
            <p className="text-lg font-semibold">KES 4,000</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button className="gradient-secondary h-16 flex-col text-white border-0 shadow-lg hover:scale-105 transition-transform">
          <Users className="w-6 h-6 mb-1" />
          <span className="text-sm">Join Batch</span>
        </Button>
        <Button className="gradient-success h-16 flex-col text-white border-0 shadow-lg hover:scale-105 transition-transform">
          <Plus className="w-6 h-6 mb-1" />
          <span className="text-sm">Create Batch</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h3>
        <div className="space-y-3">
          <Card className="p-4 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <ArrowDown className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Batch Payout Received</p>
                  <p className="text-sm text-gray-500">From "Friends Circle" batch</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+KES 5,000</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <ArrowUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Contribution</p>
                  <p className="text-sm text-gray-500">To "Work Colleagues" batch</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">-KES 1,100</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Active Batches</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <Card className="min-w-[280px] p-4 bg-white border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Friends Circle</h4>
                <p className="text-sm text-gray-500">8/10 members</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next payout</span>
                <span className="text-sm font-medium">March 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Your turn</span>
                <span className="text-sm font-medium">5th position</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </Card>

          <Card className="min-w-[280px] p-4 bg-white border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Work Colleagues</h4>
                <p className="text-sm text-gray-500">10/10 members</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Running</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next payout</span>
                <span className="text-sm font-medium">April 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Your turn</span>
                <span className="text-sm font-medium">2nd position</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
