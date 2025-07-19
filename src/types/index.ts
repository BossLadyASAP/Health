
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
