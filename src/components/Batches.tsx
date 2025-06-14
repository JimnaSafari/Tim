
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar, Clock, ArrowLeft } from 'lucide-react';

const Batches = () => {
  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" size="sm" className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">My Batches</h1>
        <Button className="gradient-primary text-white border-0 rounded-full px-4">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-gray-400">Active Batches</p>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-sm text-gray-400">Days to Payout</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Active Batches</h3>
        <div className="space-y-4">
          <Card className="glassmorphism p-5 border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">Friends Circle</h4>
                  <p className="text-sm text-gray-400">Created by you • 8/10 members</p>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Monthly Contribution</p>
                  <p className="text-lg font-semibold text-white">KES 1,100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payout Amount</p>
                  <p className="text-lg font-semibold text-white">KES 10,000</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">8 of 10 members</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  Next payout: March 15, 2024
                </div>
                <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 bg-transparent">
                  View Details
                </Button>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism p-5 border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">Work Colleagues</h4>
                  <p className="text-sm text-gray-400">Created by Mary K. • 10/10 members</p>
                </div>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                  Running
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Monthly Contribution</p>
                  <p className="text-lg font-semibold text-white">KES 1,100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Position</p>
                  <p className="text-lg font-semibold text-white">2nd</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Cycle Progress</span>
                  <span className="text-sm font-medium text-white">3 of 10 payouts</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-300" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  Your turn: April 1, 2024
                </div>
                <Button variant="outline" size="sm" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 bg-transparent">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Join Batch CTA */}
      <Card className="glassmorphism p-5 border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-600/10"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Looking to Join a Batch?</h3>
          <p className="text-gray-400 text-sm mb-4">Get an invite code from a friend and join their merry-go-round</p>
          <Button className="gradient-primary text-white border-0 rounded-full px-6">
            Enter Invite Code
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Batches;
