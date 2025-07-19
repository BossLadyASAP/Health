
import { useState, useEffect } from 'react';
import { X, Play, Trash2, Shield, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const settingsSections = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'data-controls', label: 'Data controls', icon: '🛡️' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'account', label: 'Account', icon: '👤' },
];

export function SettingsDialog({ 
  open, 
  onOpenChange, 
  selectedModel, 
  onModelChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange 
}: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState('general');
  const [spokenLanguage, setSpokenLanguage] = useState('Auto-detect');
  const [voice, setVoice] = useState('Ember');
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [exportDataLoading, setExportDataLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'Dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const playVoiceSample = () => {
    console.log(`Playing ${voice} voice sample`);
  };

  const handleExportData = async () => {
    setExportDataLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExportDataLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountLoading(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Account deletion initiated');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Theme</h3>
        </div>
        <Select value={theme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="System">System</SelectItem>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Language</h3>
        </div>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Auto-detect">Auto-detect</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Spoken language</h3>
          <p className="text-xs text-gray-500 mt-1">
            Automatically detected from your speech input
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {spokenLanguage}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Voice</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={playVoiceSample}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ember">Ember</SelectItem>
              <SelectItem value="Alloy">Alloy</SelectItem>
              <SelectItem value="Echo">Echo</SelectItem>
              <SelectItem value="Fable">Fable</SelectItem>
              <SelectItem value="Nova">Nova</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Show follow up suggestions in chats</h3>
        </div>
        <Switch
          checked={followUpSuggestions}
          onCheckedChange={setFollowUpSuggestions}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Email notifications</h3>
          <p className="text-xs text-gray-500 mt-1">
            Receive updates and news via email
          </p>
        </div>
        <Switch
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Push notifications</h3>
          <p className="text-xs text-gray-500 mt-1">
            Get notified about important updates
          </p>
        </div>
        <Switch
          checked={pushNotifications}
          onCheckedChange={setPushNotifications}
        />
      </div>
    </div>
  );

  const renderDataControlsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Data sharing</h3>
          <p className="text-xs text-gray-500 mt-1">
            Allow anonymous usage data to improve the service
          </p>
        </div>
        <Switch
          checked={dataSharing}
          onCheckedChange={setDataSharing}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium mb-4">Export your data</h3>
        <p className="text-xs text-gray-500 mb-4">
          Download a copy of all your conversations and health data
        </p>
        <Button
          onClick={handleExportData}
          disabled={exportDataLoading}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {exportDataLoading ? 'Exporting...' : 'Export Data'}
        </Button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Two-factor authentication</h3>
          <p className="text-xs text-gray-500 mt-1">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch
          checked={twoFactorAuth}
          onCheckedChange={setTwoFactorAuth}
        />
      </div>

      <div className="border-t pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="Enter current password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
          <Button className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="display-name">Display Name</Label>
          <Input id="display-name" defaultValue="John Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="john@example.com" />
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
        <p className="text-xs text-gray-500 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={deleteAccountLoading}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {deleteAccountLoading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'data-controls':
        return renderDataControlsSettings();
      case 'security':
        return renderSecuritySettings();
      case 'account':
        return renderAccountSettings();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] p-0 bg-white">
        <DialogDescription className="sr-only">
          Manage your application settings and preferences
        </DialogDescription>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
            </DialogHeader>
            <div className="p-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
