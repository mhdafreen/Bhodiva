import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  RefreshCw,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { MedicalReportData } from '../../types/medicalReport';
import { sendChatMessage } from '../../services/chatService';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicalReportData;
  language: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  report,
  language
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize welcoming greeting based on language
  useEffect(() => {
    if (messages.length === 0 && report) {
      const initialGreeting: ChatMessage = {
        id: 'msg-welcome',
        sender: 'assistant',
        text: language === 'ml'
          ? `നമസ്കാരം! നിങ്ങളുടെ ${report.metadata.reportCategory || 'ലാബ് റിപ്പോർട്ട്'} വിശദീകരിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. ഏതെങ്കിലും പരിശോധനയെക്കുറിച്ചോ സംശയങ്ങളെക്കുറിച്ചോ നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം.`
          : language === 'hi'
          ? `नमस्ते! मैं आपकी ${report.metadata.reportCategory || 'लैब रिपोर्ट'} को समझाने के लिए यहाँ हूँ। आप किसी भी टेस्ट या संख्या के बारे में मुझसे पूछ सकते हैं।`
          : `Hello! I am your Bodhiva assistant. I can help explain any parameter, reference range, or finding from your ${report.metadata.reportCategory || 'laboratory report'}. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
    }
  }, [report, language, messages.length]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Starter suggestion chips based on active language
  const starterChips = language === 'ml'
    ? [
        'ഹീമോഗ്ലോബിൻ എന്താണ് ചെയ്യുന്നത്?',
        'എന്റെ ഹീമോഗ്ലോബിൻ കുറയാൻ കാരണം എന്താണ്?',
        'ഭക്ഷണത്തിൽ എന്തൊക്കെ ശ്രദ്ധിക്കണം?',
        'ഡോക്ടറോട് ഞാൻ എന്തൊക്കെ ചോദിക്കണം?'
      ]
    : language === 'hi'
    ? [
        'हीमोग्लोबिन शरीर में क्या करता है?',
        'यह स्तर कम क्यों हो सकता है?',
        'खानपान में क्या सुधार कर सकते हैं?',
        'डॉक्टर से क्या पूछना चाहिए?'
      ]
    : [
        'What does hemoglobin do in the body?',
        'Why is my hemoglobin below reference range?',
        'What dietary changes support healthy iron?',
        'What are the most important questions for my doctor?'
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage({
        userMessage: text,
        history: messages,
        reportContext: report,
        language
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue processing your question. Please try again or rephrase.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      {/* Sliding Drawer Container */}
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideInRight">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-teal-700 to-brand-800 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-brand-200 flex items-center justify-center p-2 backdrop-blur-md border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Chat with your Report
                </h3>
                <span className="text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Context
                </span>
              </div>
              <p className="text-xs text-brand-100">
                Grounded in your {report.metadata.reportCategory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
              title="Clear conversation"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
              aria-label="Close chat drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs mt-1 shadow-sm ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-brand-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-brand-700 bg-white p-3.5 rounded-2xl border border-brand-200 max-w-xs shadow-sm animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
              <span>Bodhiva is reviewing your report details...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Chips Bar */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-2">
          {starterChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 text-xs font-semibold whitespace-nowrap border border-slate-200/80 transition disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-brand-600" />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200/80 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your report..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs sm:text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold transition shadow-md shadow-brand-600/20"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Micro Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            <span>Educational assistant only. Not a medical diagnosis or prescription.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
