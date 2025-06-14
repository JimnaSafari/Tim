
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, ChevronRight, Moon, Shield, Users, Settings } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ProfileMenuItems = () => {
  const navigate = useNavigate();

  return (
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

      <Card 
        className="glassmorphism-dark p-4 border-0 cursor-pointer hover:brightness-125 transition"
        onClick={() => navigate("/settings")}
        tabIndex={0}
        role="button"
        aria-label="Open settings"
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") navigate("/settings");
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-white">Settings</p>
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

      <Card 
        className="glassmorphism-dark p-4 border-0 cursor-pointer hover:brightness-125 transition"
        onClick={() => navigate("/referrals")}
        tabIndex={0}
        role="button"
        aria-label="View referral program"
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") navigate("/referrals");
        }}
      >
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
  );
};

export default ProfileMenuItems;
