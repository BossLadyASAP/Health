import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Settings, 
  Search,
  Activity,
  Bot,
  Edit3,
  Check,
  X,
  Calendar,
  Archive,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types';
import { SettingsDialog } from '@/components/SettingsDialog';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { UserProfileDropdown } from '@/components/auth/UserProfileDropdown';
import { useAuth } from '@/hooks/useAuth';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  currentView: 'chat' | 'tracker';
  onViewChange: (view: 'chat' | 'tracker') => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  selectedModel,
  onModelChange,
  currentView,
  onViewChange
}: ChatSidebarProps) {
  const { platformLanguage, setPlatformLanguage } = useLanguage();
  const { t } = useTranslation();
  const { state } = useSidebar();
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingConversation, setEditingConversation] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  
  const { user, loading } = useAuth();
  const isCollapsed = state === "collapsed";

  // Handle conversation rename
  const handleRenameStart = (conversation: Conversation) => {
    setEditingConversation(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleRenameConfirm = () => {
    if (editingConversation && editTitle.trim() && onRenameConversation) {
      onRenameConversation(editingConversation, editTitle.trim());
    }
    setEditingConversation(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingConversation(null);
    setEditTitle('');
  };

  // Sort and filter conversations
  const sortedConversations = [...conversations].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const filteredConversations = sortedConversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="offcanvas">
        <SidebarHeader className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <SidebarTrigger className="h-6 w-6" />
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Button
                      onClick={onNewConversation}
                      size="sm"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0"
                    >
                      <Plus className="h-4 w-4" />
                      {t('New Chat')}
                    </Button>
                    
                    <UserProfileDropdown onSettingsClick={() => setShowSettings(true)} />
                  </>
                ) : (
                  <Button
                    onClick={() => setShowAuthDialog(true)}
                    size="sm"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    Login
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {!isCollapsed && currentView === 'chat' && user && (
            <div className="space-y-2">
              {/* Patient Information Button */}
              <Button
                onClick={() => setShowPatientInfo(!showPatientInfo)}
                variant="outline"
                className="w-full flex items-center justify-between text-sm h-9"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('Patient Information')}
                </div>
                {showPatientInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {/* Patient Information Panel */}
              {showPatientInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <h4 className="font-medium text-sm text-blue-900">{t('Patient Diagnosis')}</h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p><strong>{t('Primary Condition')}:</strong> {t('Hypertension, Type 2 Diabetes')}</p>
                    <p><strong>{t('Secondary Conditions')}:</strong> {t('Mild Anxiety, Sleep Apnea')}</p>
                    <p><strong>{t('Current Medications')}:</strong> {t('Metformin 500mg, Lisinopril 10mg')}</p>
                    <p><strong>{t('Allergies')}:</strong> {t('Penicillin, Shellfish')}</p>
                    <p><strong>{t('Last Visit')}:</strong> {t('December 15, 2024')}</p>
                    <p><strong>{t('Next Appointment')}:</strong> {t('January 20, 2025')}</p>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('Search chats...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'date' ? 'default' : 'ghost'}
                  onClick={() => setSortBy('date')}
                  className="flex items-center gap-1 text-xs h-7"
                >
                  <Calendar className="h-3 w-3" />
                  {t('Date')}
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'name' ? 'default' : 'ghost'}
                  onClick={() => setSortBy('name')}
                  className="flex items-center gap-1 text-xs h-7"
                >
                  <Archive className="h-3 w-3" />
                  Name
                </Button>
              </div>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="p-2">
          {currentView === 'chat' && user && (
            <ScrollArea className="flex-1">
              <SidebarMenu>
                {filteredConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={conversation.id === activeConversationId}
                      className="group relative"
                      onMouseEnter={() => setHoveredConversation(conversation.id)}
                      onMouseLeave={() => setHoveredConversation(null)}
                    >
                      <div
                        onClick={() => onConversationSelect(conversation.id)}
                        className="flex items-center justify-between w-full cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare className="h-4 w-4 flex-shrink-0" />
                          {!isCollapsed && (
                            editingConversation === conversation.id ? (
                              <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                                <Input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="h-6 text-xs flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameConfirm();
                                    if (e.key === 'Escape') handleRenameCancel();
                                  }}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleRenameConfirm}
                                  className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleRenameCancel}
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="truncate text-sm">
                                {conversation.title}
                              </span>
                            )
                          )}
                        </div>
                        
                        {!isCollapsed && hoveredConversation === conversation.id && editingConversation !== conversation.id && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameStart(conversation);
                              }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conversation.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          )}

          {!user && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 p-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm mb-2">Sign in to access</p>
                <p className="text-xs">Chat history and tracker</p>
              </div>
            </div>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200">
          {user && (
            <Button
              onClick={() => onViewChange(currentView === 'chat' ? 'tracker' : 'chat')}
              className={`w-full flex items-center gap-2 ${
                currentView === 'tracker' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Activity className="h-4 w-4" />
              {!isCollapsed && (currentView === 'chat' ? 'My Tracker' : 'Back to Chat')}
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
}
