
import { useState, useEffect } from 'react';
import { X, Play, Trash2, Shield, Download, Bot } from 'lucide-react';
import { SystemPromptsDialog } from './SystemPromptsDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
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
  currentSystemPrompt?: any;
  onSystemPromptChange?: (prompt: any) => void;
}

// Settings sections will be translated in the component

export const SettingsDialog = ({
  open,
  onOpenChange,
  selectedModel,
  onModelChange,
  currentSystemPrompt,
  onSystemPromptChange,
}: SettingsDialogProps) => {
  const { platformLanguage, setPlatformLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Translatable settings sections
  const settingsSections = [
    { id: 'general', label: t('General'), icon: '⚙️' },
    { id: 'system-prompts', label: t('AI Prompts'), icon: '🤖' },
    { id: 'notifications', label: t('Notifications'), icon: '🔔' },
    { id: 'data-controls', label: t('Data controls'), icon: '🛡️' },
    { id: 'security', label: t('Security'), icon: '🔒' },
    { id: 'account', label: t('Account'), icon: '👤' },
  ];
  const [activeSection, setActiveSection] = useState('general');
  const [spokenLanguage, setSpokenLanguage] = useState('Auto-detect');
  const [voice, setVoice] = useState('Ember');
  const [voiceLanguage, setVoiceLanguage] = useState('Auto-detect');
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [exportDataLoading, setExportDataLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [systemPromptsOpen, setSystemPromptsOpen] = useState(false);

  // Language changes are now handled automatically by LanguageContext

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

  const renderSystemPromptsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Current AI Behavior</h3>
          <p className="text-xs text-gray-500 mt-1">
            {currentSystemPrompt ? currentSystemPrompt.name : 'Default Health Assistant'}
          </p>
        </div>
        <Button 
          onClick={() => setSystemPromptsOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          Manage Prompts
        </Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">About System Prompts</h4>
        <p className="text-xs text-gray-600">
          System prompts define how your AI assistant behaves and responds. Choose from health-focused prompts like Mental Health Support, Nutrition Coach, or Fitness Trainer to get specialized assistance.
        </p>
      </div>
      
      {currentSystemPrompt && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium">{currentSystemPrompt.name}</h4>
          </div>
          <p className="text-xs text-gray-600 mb-2">{currentSystemPrompt.description}</p>
          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded line-clamp-3">
            {currentSystemPrompt.prompt}
          </p>
        </div>
      )}
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{t('Platform Language')}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('Changes site, AI, and chat language')}
          </p>
        </div>
        <Select value={platformLanguage} onValueChange={setPlatformLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Auto-detect">Auto-detect</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="French">Français</SelectItem>
            <SelectItem value="Spanish">Español</SelectItem>
            <SelectItem value="German">Deutsch</SelectItem>
            <SelectItem value="Portuguese">Português</SelectItem>
            <SelectItem value="Italian">Italiano</SelectItem>
            <SelectItem value="Dutch">Nederlands</SelectItem>
            <SelectItem value="Russian">Русский</SelectItem>
            <SelectItem value="Chinese">中文</SelectItem>
            <SelectItem value="Japanese">日本語</SelectItem>
            <SelectItem value="Korean">한국어</SelectItem>
            <SelectItem value="Arabic">العربية</SelectItem>
            <SelectItem value="Hindi">हिन्दी</SelectItem>
            <SelectItem value="Fulfulde">Fulfulde</SelectItem>
            <SelectItem value="Ewondo">Ewondo</SelectItem>
            <SelectItem value="Duala">Duálá</SelectItem>
            <SelectItem value="Bamileke">Bamiléké</SelectItem>
            <SelectItem value="Bassa">Bassa</SelectItem>
            <SelectItem value="Bamoun">Bamoun</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{t('Spoken language')}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('Automatically detected from your speech input')}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {spokenLanguage}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{t('Voice Language')}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('Language for chat response audio')}
          </p>
        </div>
        <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Auto-detect">Auto-detect</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="French">Français</SelectItem>
            <SelectItem value="Spanish">Español</SelectItem>
            <SelectItem value="German">Deutsch</SelectItem>
            <SelectItem value="Portuguese">Português</SelectItem>
            <SelectItem value="Italian">Italiano</SelectItem>
            <SelectItem value="Dutch">Nederlands</SelectItem>
            <SelectItem value="Russian">Русский</SelectItem>
            <SelectItem value="Chinese">中文</SelectItem>
            <SelectItem value="Japanese">日本語</SelectItem>
            <SelectItem value="Korean">한국어</SelectItem>
            <SelectItem value="Arabic">العربية</SelectItem>
            <SelectItem value="Hindi">हिन्दी</SelectItem>
            <SelectItem value="Fulfulde">Fulfulde</SelectItem>
            <SelectItem value="Ewondo">Ewondo</SelectItem>
            <SelectItem value="Duala">Duálá</SelectItem>
            <SelectItem value="Bamileke">Bamiléké</SelectItem>
            <SelectItem value="Bassa">Bassa</SelectItem>
            <SelectItem value="Bamoun">Bamoun</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{t('Voice')}</h3>
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
          <h3 className="text-sm font-medium">{t('Show follow up suggestions in chats')}</h3>
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
      case 'system-prompts':
        return renderSystemPromptsSettings();
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
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </DialogContent>
      
      <SystemPromptsDialog
        open={systemPromptsOpen}
        onOpenChange={setSystemPromptsOpen}
        onPromptSelect={onSystemPromptChange || (() => {})}
      />
    </Dialog>
  );
}
