
import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import CreateBatchForm from './CreateBatchForm';
import JoinBatchForm from './JoinBatchForm';
import SaveMoneyForm from './SaveMoneyForm';
import DashboardHeader from './Dashboard/DashboardHeader';
import ServiceFeeInfo from './Dashboard/ServiceFeeInfo';
import BalanceCard from './Dashboard/BalanceCard';
import QuickActions from './Dashboard/QuickActions';
import RecentActivity from './Dashboard/RecentActivity';
import ActiveBatches from './Dashboard/ActiveBatches';

const Dashboard = () => {
  const [showBalance, setShowBalance] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showJoinForm, setShowJoinForm] = React.useState(false);
  const [showSaveForm, setShowSaveForm] = React.useState(false);
  const { userData, loading, refreshUserData } = useUserData();

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
  const avatarUrl = userData?.profile?.avatar_url;

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      <DashboardHeader 
        userName={userName}
        userInitials={userInitials}
        avatarUrl={avatarUrl}
      />

      <ServiceFeeInfo />

      <BalanceCard
        showBalance={showBalance}
        savingsBalance={userData?.savingsBalance || 0}
        monthlyTotal={userData?.monthlyTotal || 0}
        batchesCount={userData?.batches?.length || 0}
        onToggleBalance={() => setShowBalance(!showBalance)}
        onAddMoney={() => setShowSaveForm(true)}
      />

      <QuickActions
        onJoinBatch={() => setShowJoinForm(true)}
        onCreateBatch={() => setShowCreateForm(true)}
      />

      <RecentActivity recentSavings={userData?.recentSavings} />

      <ActiveBatches
        batches={userData?.batches}
        onCreateBatch={() => setShowCreateForm(true)}
        onJoinBatch={() => setShowJoinForm(true)}
      />

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
