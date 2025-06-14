
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar, Clock } from 'lucide-react';

const Batches = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Batches</h1>
          <p className="text-gray-600">Manage your merry-go-round groups</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Active Batches</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-500">Days to Payout</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Active Batches</h3>
        <div className="space-y-4">
          <Card className="p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Friends Circle</h4>
                <p className="text-sm text-gray-500">Created by you • 8/10 members</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Contribution</p>
                <p className="text-lg font-semibold text-gray-900">KES 1,100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payout Amount</p>
                <p className="text-lg font-semibold text-gray-900">KES 10,000</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">8 of 10 members</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                Next payout: March 15, 2024
              </div>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                View Details
              </Button>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Work Colleagues</h4>
                <p className="text-sm text-gray-500">Created by Mary K. • 10/10 members</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                Running
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Contribution</p>
                <p className="text-lg font-semibold text-gray-900">KES 1,100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Position</p>
                <p className="text-lg font-semibold text-gray-900">2nd</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Cycle Progress</span>
                <span className="text-sm font-medium text-gray-900">3 of 10 payouts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                Your turn: April 1, 2024
              </div>
              <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                View Details
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Join Batch CTA */}
      <Card className="gradient-secondary p-5 text-white border-0 shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Looking to Join a Batch?</h3>
          <p className="text-pink-100 text-sm mb-4">Get an invite code from a friend and join their merry-go-round</p>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
            Enter Invite Code
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Batches;
