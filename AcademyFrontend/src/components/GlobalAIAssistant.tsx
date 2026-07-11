'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function GlobalAIAssistant() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    // Initialiser avec un message de bienvenue si vide
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: 'Bonjour ! Je suis Kibo, votre assistant IA MLAcademy. Comment puis-je vous aider aujourd\'hui ?'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  if (loading || !user) {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetchApi('/api/chat/global/', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.text,
          chatHistory: currentHistory.map(m => ({ role: m.role, text: m.text }))
        })
      });
      
      if (response && response.reply) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: response.reply }]);
      }
    } catch (err) {
      console.error("Erreur Chat Global:", err);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        text: 'Oups, je rencontre une difficulté technique. Veuillez réessayer plus tard.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: 'Historique effacé. Comment puis-je vous aider ?'
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Fenêtre de Chat */}
      {isOpen && (
        <div 
          className={`mb-4 bg-[#0A192F] border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-[80vw] h-[80vh] max-w-4xl' : 'w-80 h-[500px] sm:w-96'
          }`}
        >
          {/* Header */}
          <div className="bg-[#112240] p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00D1FF]/20 flex items-center justify-center text-[#00D1FF]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Assistant IA</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Connecté à MLAcademy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="text-slate-400 hover:text-white p-1 rounded transition-colors" title="Effacer">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-white p-1 rounded transition-colors" title={isExpanded ? "Réduire" : "Agrandir"}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors" title="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A192F]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#00D1FF] text-[#0A192F] rounded-br-none font-medium' 
                      : 'bg-[#112240] text-slate-200 rounded-bl-none border border-white/5 whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#112240] text-slate-200 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-[#112240] border-t border-white/10">
            <div className="flex items-center gap-2 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                className="w-full bg-[#0A192F] text-sm text-white rounded-xl py-3 pl-4 pr-12 border border-white/10 focus:outline-none focus:border-[#00D1FF] resize-none h-12"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] hover:bg-[#00D1FF] hover:text-[#0A192F] flex items-center justify-center disabled:opacity-50 disabled:hover:bg-[#00D1FF]/10 transition-colors"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-rose-500 text-white rotate-90' : 'bg-[#00D1FF] text-[#0A192F]'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </button>
    </div>
  );
}
