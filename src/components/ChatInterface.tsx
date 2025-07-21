import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, LogIn, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { VoiceInput } from '@/components/VoiceInput';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Message } from '@/types';

import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from './auth/AuthDialog';

interface ChatInterfaceProps {
  conversation: {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
  } | undefined;
  onSendMessage: (message: string) => void;
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex items-start gap-3 mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Robot Avatar - show on left for AI messages */}
      {!message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <img 
            src="/robot-favicon.svg" 
            alt="AI Assistant" 
            className="w-6 h-6"
          />
        </div>
      )}
      
      {/* Message Content */}
      <div
        className={`rounded-xl px-4 py-2 text-sm max-w-[75%] ${
          message.isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.content}
      </div>
      
      {/* User Avatar - show on right for user messages */}
      {message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

export function ChatInterface({ conversation, onSendMessage }: ChatInterfaceProps) {

  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const { platformLanguage, languageCode } = useLanguage();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Listen for language updates to force re-render
  // Language updates are now handled automatically by LanguageContext

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {

      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleVoiceTranscription = (text: string, detectedLanguage?: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + text);
    setIsVoiceListening(false);
    
    if (detectedLanguage) {
      console.log('Detected language:', detectedLanguage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
        <h1 className="text-xl font-semibold text-gray-800">
          {conversation?.title || 'New Conversation'}
        </h1>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversation?.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Type a message or use voice input to begin</p>
            </div>
          </div>
        ) : (
          conversation?.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('Type your message...')}
              className="min-h-[60px] resize-none"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <VoiceInput
              onTranscription={handleVoiceTranscription}
              isListening={isVoiceListening}
              className="w-full"
            />
            <Button 
              type="submit" 
              disabled={!message.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {t('Send')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
