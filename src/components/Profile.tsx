
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Edit, User, FileText, ChevronRight, Moon, Shield, Users } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import EditProfileForm from './EditProfileForm';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userData, loading, refreshUserData } = useUserData();
  const { signOut } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const name = userData?.profile?.full_name || 'User';
  const email = userData?.profile?.email || userData?.email || 'unknown@email.com';

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-12">
        <Button variant="ghost" size="sm" className="text-white p-2" aria-label="Back">
          {/* You might want to add navigation logic here */}
          <User className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-medium">Profile</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-white p-2"
          aria-label="Edit Profile"
          onClick={() => setShowEdit(true)}
        >
          <Edit className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="glassmorphism p-6 mb-6 border-0 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">{name}</h2>
          <p className="text-gray-400 mb-2">{email}</p>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:text-white mt-3"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" /> Log out
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">3</div>
          <div className="text-xs text-gray-400">Active Batches</div>
        </Card>
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">12</div>
          <div className="text-xs text-gray-400">Payouts</div>
        </Card>
        <Card className="glassmorphism-dark p-4 border-0 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">98%</div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="space-y-3 mb-6">
        <Card
          className="glassmorphism-dark p-4 border-0 cursor-pointer hover:brightness-125 transition"
          onClick={() => navigate("/payment-requests")}
          tabIndex={0}
          role="button"
          aria-label="View payment requests"
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") navigate("/payment-requests");
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">Payment requests</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-white">Dark Theme</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-cyan-500 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-white">Security</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card 
          className="glassmorphism-dark p-4 border-0 cursor-pointer hover:brightness-125 transition"
          onClick={() => navigate("/statements")}
          tabIndex={0}
          role="button"
          aria-label="View statements and reports"
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") navigate("/statements");
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">Statements & reports</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card className="glassmorphism-dark p-4 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white">Referral</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfileForm
          initialName={name}
          initialEmail={email}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            refreshUserData();
          }}
        />
      )}
    </div>
  );
};

export default Profile;
