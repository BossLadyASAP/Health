
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { HealthTracker } from '@/components/HealthTracker';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { CreditProvider } from '@/context/CreditContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types';

function IndexContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [currentView, setCurrentView] = useState<'chat' | 'tracker'>('chat');
  const [theme, setTheme] = useState('System');
  const [language, setLanguage] = useState('Auto-detect');

  const { user, loading } = useAuth();

  // Load conversations when user is authenticated
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      // Setup a default local conversation for guests
      const guestConversation: Conversation = {
        id: 'guest-conversation',
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        user_id: 'guest'
      };
      setConversations([guestConversation]);
      setActiveConversationId(guestConversation.id);
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    const formattedConversations = data.map(conv => ({
      id: conv.id,
      title: conv.title,
      messages: [],
      createdAt: new Date(conv.created_at),
      user_id: conv.user_id
    }));

    setConversations(formattedConversations);
    
    if (formattedConversations.length > 0 && !activeConversationId) {
      setActiveConversationId(formattedConversations[0].id);
    }
  };

  const handleNewConversation = async () => {
    if (!user) return; // Guests can't create new conversations

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        title: 'New Conversation',
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return;
    }

    const newConversation: Conversation = {
      id: data.id,
      title: data.title,
      messages: [],
      createdAt: new Date(data.created_at),
      user_id: data.user_id
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const handleDeleteConversation = async (id: string) => {
    if (!user) return; // Guests can't delete conversations

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting conversation:', error);
      return;
    }

    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        handleNewConversation();
        return filtered;
      }
      if (id === activeConversationId) {
        setActiveConversationId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Update local state
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            title: conv.messages.length === 0 ? content.slice(0, 30) + '...' : conv.title
          }
        : conv
    ));

    // If user is logged in, save to database
    if (user) {
      await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          content,
          is_user: true
        });
    }

    // Update conversation title if it's the first message and user is logged in
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (user && conversation?.messages.length === 0) {
      await supabase
        .from('conversations')
        .update({ title: content.slice(0, 30) + '...' })
        .eq('id', activeConversationId);
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a response to: "${content}"`,
        isUser: false,
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, aiResponse] }
          : conv
      ));

      // If user is logged in, save AI response to database
      if (user) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: activeConversationId,
            content: aiResponse.content,
            is_user: false
          });
      }
    }, 1000);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Always visible sidebar trigger */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <SidebarTrigger className="h-8 w-8 bg-white shadow-md border" />
        </div>

        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          currentView={currentView}
          onViewChange={setCurrentView}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />
        
        <SidebarInset className="flex-1">
          {/* Desktop sidebar trigger */}
          <div className="hidden md:block fixed top-4 left-4 z-50">
            <SidebarTrigger className="h-8 w-8 bg-white shadow-md border" />
          </div>

          <main className="flex-1 p-4 pt-16 md:pt-4">
            {currentView === 'chat' ? (
              <ChatInterface
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <HealthTracker />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <CreditProvider>
        <IndexContent />
      </CreditProvider>
    </AuthProvider>
  );
};

export default Index;
