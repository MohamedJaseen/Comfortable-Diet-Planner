import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, HelpCircle } from 'lucide-react';
import api from '../utils/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const AiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am your AI Nutritionist. Ask me anything about foods, diet strategies, or healthy recipes!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsSending(true);

    try {
      const response = await api.post('/chat', { message: userMessage });
      const botResponse = response.data.response || 'I am sorry, I could not retrieve an answer at this moment.';
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error: any) {
      console.error('Error sending chat message:', error);
      const errMsg = error.response?.data?.message || 'Connection lost. Please make sure the backend server is running.';
      setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errMsg}` }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { sender: 'bot', text: 'Chat cleared. How can I help you today with your nutrition goals?' }
    ]);
  };

  const sampleQuestions = [
    "Can I eat rice while losing weight?",
    "Suggest a vegetarian breakfast.",
    "What foods contain iron?",
    "Give high protein dinner ideas."
  ];

  const handleAskSample = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">AI Nutrition Assistant</h3>
            <p className="text-xs text-green-100">Personalized Diet & Food Expert</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="text-green-100 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full text-white ${msg.sender === 'user' ? 'bg-green-600' : 'bg-blue-600'}`}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                msg.sender === 'user'
                  ? 'bg-green-500 text-white border-green-400 rounded-tr-none'
                  : 'bg-white text-gray-800 border-gray-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white text-gray-800 border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Panel */}
      <div className="p-4 border-t bg-white space-y-3">
        {messages.length === 1 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Frequently Asked Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskSample(q)}
                  className="text-xs bg-gray-100 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about foods, plans, ingredients..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatbot;
