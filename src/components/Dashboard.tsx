
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ArrowUp, ArrowDown, Eye, EyeOff, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserData } from '@/hooks/useUserData';
import CreateBatchForm from './CreateBatchForm';
import JoinBatchForm from './JoinBatchForm';
import SaveMoneyForm from './SaveMoneyForm';

const Dashboard = () => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showJoinForm, setShowJoinForm] = React.useState(false);
  const [showSaveForm, setShowSaveForm] = React.useState(false);
  const { userData, loading, refreshUserData } = useUserData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const handleFormSuccess = () => {
    refreshUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = userData?.profile?.full_name || 'User';
  const userInitials = getInitials(userName);

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-12 animate-fade-in">
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">{getGreeting()}</p>
          <h1 className="text-xl font-medium text-white">{userName}</h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden hover-lift">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt={userName}
            />
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-purple-600 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
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
                {showBalance ? `KES ${userData?.savingsBalance?.toLocaleString() || '0'}` : '••••••'}
              </h2>
            </div>
            <Button 
              size="sm" 
              className="gradient-primary text-white border-0 rounded-full px-4 interactive-button ripple-effect"
              onClick={() => setShowSaveForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex justify-between mt-6">
            <div className="animate-slide-up">
              <p className="text-gray-400 text-xs">This Month</p>
              <p className="text-lg font-semibold text-white">
                {showBalance ? `KES ${userData?.monthlyTotal?.toLocaleString() || '0'}` : '••••••'}
              </p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-gray-400 text-xs">In Batches</p>
              <p className="text-lg font-semibold text-white">
                {showBalance ? `KES ${((userData?.batches?.length || 0) * 1000).toLocaleString()}` : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="glassmorphism-dark p-4 border-0 hover-lift transition-transform cursor-pointer stagger-item interactive-button"
          onClick={() => setShowJoinForm(true)}
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
          onClick={() => setShowCreateForm(true)}
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

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Recent Activity</h3>
        <div className="space-y-3">
          {userData?.recentSavings && userData.recentSavings.length > 0 ? (
            userData.recentSavings.slice(0, 3).map((transaction: any, index: number) => (
              <Card key={transaction.id} className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${
                      transaction.transaction_type === 'deposit' 
                        ? 'bg-green-500/20' 
                        : 'bg-red-500/20'
                    } flex items-center justify-center animate-bounce-in`}>
                      {transaction.transaction_type === 'deposit' ? (
                        <ArrowDown className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowUp className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {transaction.transaction_type === 'deposit' ? 'Money Saved' : 'Withdrawal'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.description || 'Personal savings'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right animate-scale-in">
                    <p className={`font-semibold ${
                      transaction.transaction_type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}KES {Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="glassmorphism-dark p-4 border-0 hover-lift stagger-item">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-in">
                    <ArrowDown className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Welcome!</p>
                    <p className="text-sm text-gray-400">Start saving or join a batch</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white animate-fade-in">Your Batches</h3>
        {userData?.batches && userData.batches.length > 0 ? (
          <div className="space-y-4">
            {userData.batches.slice(0, 2).map((batch: any, index: number) => (
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
                onClick={() => setShowCreateForm(true)}
              >
                Create Batch
              </Button>
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => setShowJoinForm(true)}
              >
                Join Batch
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Forms */}
      {showCreateForm && (
        <CreateBatchForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showJoinForm && (
        <JoinBatchForm
          onClose={() => setShowJoinForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showSaveForm && (
        <SaveMoneyForm
          onClose={() => setShowSaveForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
