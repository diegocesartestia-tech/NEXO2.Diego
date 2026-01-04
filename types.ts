
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Insight {
  topic: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'reflective';
}

export interface AppState {
  messages: Message[];
  isTyping: boolean;
  showInsights: boolean;
  insights: Insight[];
}
