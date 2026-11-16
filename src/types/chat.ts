export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface SendChatMessageParams {
  userMessage: string;
  history: ChatMessage[];
  reportContext: any;
  language: string;
}
