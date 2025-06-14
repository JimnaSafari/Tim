
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ArrowUp, ArrowDown, Eye, EyeOff, Info } from 'lucide-react';

const Dashboard = () => {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-12 animate-fade-in">
        <div>
          <p className="text-gray-400 text-sm">Good morning</p>
          <h1 className="text-xl font-medium text-white">John Doe</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden hover-lift">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Service Fee Info */}
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

      {/* Balance Card */}
      <Card className="glassmorphism p-6 mb-6 border-0 relative overflow-hidden hover-lift stagger-item">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 text-sm">Total Balance</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 h-auto text-gray-400 hover:text-white interactive-button"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <h2 className="text-3xl font-bold text-white animate-scale-in">
                {showBalance ? 'KES 12,500' : '••••••'}
              </h2>
            </div>
            <Button 
              size="sm" 
              className="gradient-primary text-white border-0 rounded-full px-4 interactive-button ripple-effect"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex justify-between mt-6">
            <div className="animate-slide-up">
              <p className="text-gray-400 text-xs">Available</p>
              <p className="text-lg font-semibold text-white">
                {showBalance ? 'KES 8,500' : '••••••'}
              </p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-gray-400 text-xs">In Batches</p>
              <p className="text-lg font-semibold text-white">
                {showBalance ? 'KES 4,000' : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0 hover-lift transition-transform cursor-pointer stagger-item interactive-button">
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

        <Card className="glassmorphism-dark p-4 border-0 hover-lift transition-transform cursor-pointer stagger-item interactive-button">
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

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Recent Activity</h3>
        <div className="space-y-3">
          <Card className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
                  <ArrowDown className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Batch Payout</p>
                  <p className="text-sm text-gray-400">From "Friends Circle"</p>
                </div>
              </div>
              <div className="text-right animate-scale-in">
                <p className="font-semibold text-green-400">+KES 5,000</p>
                <p className="text-xs text-gray-500">2h ago</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center animate-bounce-in">
                  <ArrowUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Contribution</p>
                  <p className="text-sm text-gray-400">To "Work Group"</p>
                </div>
              </div>
              <div className="text-right animate-scale-in">
                <p className="font-semibold text-red-400">-KES 1,100</p>
                <p className="text-xs text-gray-500">1d ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Your Batches</h3>
        <div className="space-y-4">
          <Card className="glassmorphism p-4 border-0 relative overflow-hidden hover-lift stagger-item">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-lg animate-float"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">Friends Circle</h4>
                  <p className="text-sm text-gray-400">8/10 members</p>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 animate-pulse-glow">
                  Active
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-3">
                <div className="animate-slide-up">
                  <p className="text-gray-400">Your position</p>
                  <p className="text-white font-medium">5th</p>
                </div>
                <div className="text-right animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <p className="text-gray-400">Next payout</p>
                  <p className="text-white font-medium">Mar 15</p>
                </div>
              </div>

              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full progress-bar" style={{ width: '80%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
