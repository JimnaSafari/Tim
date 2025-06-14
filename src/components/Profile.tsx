
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Bell, ArrowUp, Calendar } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
          JD
        </div>
        <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
        <p className="text-gray-600">+254 712 345 678</p>
        <p className="text-sm text-gray-500">Member since March 2024</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
          <div className="text-xs text-gray-500">Active Batches</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">12</div>
          <div className="text-xs text-gray-500">Payouts Received</div>
        </Card>
        <Card className="p-4 bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
          <div className="text-xs text-gray-500">Payment Rate</div>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="p-5 mb-6 bg-white border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Financial Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <ArrowUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Total Contributions</p>
                <p className="text-sm text-gray-500">Last 12 months</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">KES 36,300</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Total Payouts</p>
                <p className="text-sm text-gray-500">Received to date</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">KES 60,000</p>
          </div>
        </div>
      </Card>

      {/* Menu Options */}
      <div className="space-y-3 mb-6">
        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-500">Update your personal information</p>
              </div>
            </div>
          </Button>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
          </Button>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-sm">
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">App preferences and security</p>
              </div>
            </div>
          </Button>
        </Card>
      </div>

      {/* Achievement Badge */}
      <Card className="gradient-success p-5 text-white border-0 shadow-lg text-center">
        <div className="text-3xl mb-2">🏆</div>
        <h3 className="text-lg font-semibold mb-1">Reliable Member</h3>
        <p className="text-cyan-100 text-sm">Perfect payment record for 6 months!</p>
      </Card>
    </div>
  );
};

export default Profile;
