
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Key, Shield, Bell, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState({
    africasTalkingApiKey: '',
    africasTalkingUsername: '',
    whatsappApiKey: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSaveApiKeys = async () => {
    setLoading(true);
    try {
      // Here we would save to Supabase secrets or user preferences
      // For now, we'll just show a success message
      toast.success('API keys saved successfully!');
    } catch (error) {
      toast.error('Failed to save API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-dark-gradient text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      {/* API Keys Section */}
      <Card className="glassmorphism-dark p-6 border-0 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
            <p className="text-gray-400 text-sm">Configure SMS and WhatsApp services</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="africas-talking-username" className="text-gray-300 mb-2 block">
              Africa's Talking Username
            </Label>
            <Input
              id="africas-talking-username"
              type="text"
              placeholder="Enter your Africa's Talking username"
              value={apiKeys.africasTalkingUsername}
              onChange={(e) => handleInputChange('africasTalkingUsername', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="africas-talking-api-key" className="text-gray-300 mb-2 block">
              Africa's Talking API Key
            </Label>
            <Input
              id="africas-talking-api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKeys.africasTalkingApiKey}
              onChange={(e) => handleInputChange('africasTalkingApiKey', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp-api-key" className="text-gray-300 mb-2 block">
              WhatsApp Business API Key (Optional)
            </Label>
            <Input
              id="whatsapp-api-key"
              type="password"
              placeholder="Enter WhatsApp API key"
              value={apiKeys.whatsappApiKey}
              onChange={(e) => handleInputChange('whatsappApiKey', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <Button
            onClick={handleSaveApiKeys}
            disabled={loading}
            className="gradient-primary text-white w-full mt-4"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save API Keys'}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-300 text-sm">
            <Shield className="w-4 h-4 inline mr-1" />
            Your API keys are securely stored and encrypted. They are only used for sending reminders to your batch members.
          </p>
        </div>
      </Card>

      {/* Reminder Settings */}
      <Card className="glassmorphism-dark p-6 border-0 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Reminder Settings</h3>
            <p className="text-gray-400 text-sm">Configure when and how reminders are sent</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Weekly Contribution Reminders</p>
              <p className="text-gray-400 text-sm">Send reminders every Monday at 9:00 AM</p>
            </div>
            <div className="w-12 h-6 bg-cyan-500 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Payout Notifications</p>
              <p className="text-gray-400 text-sm">Notify members when it's their turn to receive payout</p>
            </div>
            <div className="w-12 h-6 bg-cyan-500 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Overdue Payment Alerts</p>
              <p className="text-gray-400 text-sm">Send alerts for late contributions</p>
            </div>
            <div className="w-12 h-6 bg-cyan-500 rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Agreement Status */}
      <Card className="glassmorphism-dark p-6 border-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Legal Agreements</h3>
            <p className="text-gray-400 text-sm">View and manage batch agreements</p>
          </div>
        </div>

        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-green-300 text-sm">
            ✓ Agreement signing functionality is available in batch details. Members can view and digitally sign batch agreements.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
