
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar, Clock, ArrowLeft } from 'lucide-react';
import CreateBatchForm from './CreateBatchForm';
import JoinBatchForm from './JoinBatchForm';
import { useUserData } from '@/hooks/useUserData';

const Batches = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { userData, loading, refreshUserData } = useUserData();

  const handleFormSuccess = () => {
    refreshUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" size="sm" className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">My Batches</h1>
        <Button 
          className="gradient-primary text-white border-0 rounded-full px-4"
          onClick={() => setShowCreateForm(true)}
        >
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
              <p className="text-2xl font-bold text-white">
                {userData?.batches?.length || 0}
              </p>
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
              <p className="text-2xl font-bold text-white">-</p>
              <p className="text-sm text-gray-400">Days to Payout</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Batches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Active Batches</h3>
        
        {userData?.batches && userData.batches.length > 0 ? (
          <div className="space-y-4">
            {userData.batches.map((batch: any, index: number) => (
              <Card key={batch.id} className="glassmorphism p-5 border-0 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-br from-cyan-400/20 to-purple-600/20' 
                    : 'bg-gradient-to-br from-purple-400/20 to-pink-600/20'
                } rounded-full blur-xl`}></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{batch.name}</h4>
                      <p className="text-sm text-gray-400">
                        {batch.created_by === userData.profile?.id ? 'Created by you' : 'Member'} • 
                        {batch.current_members}/{batch.max_members} members
                      </p>
                    </div>
                    <span className={`${
                      batch.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    } text-xs px-3 py-1 rounded-full border`}>
                      {batch.status === 'recruiting' ? 'Recruiting' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Monthly Contribution</p>
                      <p className="text-lg font-semibold text-white">KES {batch.monthly_contribution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Invite Code</p>
                      <p className="text-lg font-semibold text-white font-mono">{batch.invite_code}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-white">
                        {batch.current_members} of {batch.max_members} members
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div 
                        className={`${
                          index % 2 === 0 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                            : 'bg-gradient-to-r from-purple-400 to-pink-500'
                        } h-2 rounded-full transition-all duration-300`} 
                        style={{ width: `${(batch.current_members / batch.max_members) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {batch.status === 'recruiting' ? 'Recruiting members' : 'Next payout: TBD'}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`${
                        index % 2 === 0 
                          ? 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
                          : 'border-purple-400/30 text-purple-400 hover:bg-purple-400/10'
                      } bg-transparent`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glassmorphism-dark p-8 border-0 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Batches Yet</h4>
            <p className="text-gray-400 mb-4">Create your first batch or join an existing one</p>
            <Button 
              className="gradient-primary text-white"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Batch
            </Button>
          </Card>
        )}
      </div>

      {/* Join Batch CTA */}
      <Card className="glassmorphism p-5 border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-600/10"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Looking to Join a Batch?</h3>
          <p className="text-gray-400 text-sm mb-4">Get an invite code from a friend and join their merry-go-round</p>
          <Button 
            className="gradient-primary text-white border-0 rounded-full px-6"
            onClick={() => setShowJoinForm(true)}
          >
            Enter Invite Code
          </Button>
        </div>
      </Card>

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
    </div>
  );
};

export default Batches;
