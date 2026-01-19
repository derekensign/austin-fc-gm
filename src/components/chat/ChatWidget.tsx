'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey! I'm your Austin FC GM assistant powered by Claude AI. Ask me anything about the roster, salary cap, potential signings, or MLS rules! 🌳⚽",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        // toTextStreamResponse sends plain text chunks
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        setMessages(prev => 
          prev.map(m => 
            m.id === assistantId 
              ? { ...m, content: assistantContent }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const text = action === 'Can we sign...?' 
      ? 'Can we sign a $2M international striker?' 
      : action;
    setInput(text);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] shadow-lg shadow-[var(--verde)]/30 flex items-center justify-center hover:scale-110 transition-transform ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="h-6 w-6 text-black" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-100px)] rounded-2xl bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--obsidian-lighter)] bg-gradient-to-r from-[var(--verde)]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center">
                  <Bot className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">GM Assistant</h3>
                  <p className="text-xs text-[var(--verde)]">Powered by Claude AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--obsidian-lighter)] text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)]' 
                      : 'bg-[var(--obsidian-lighter)]'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4 text-black" />
                    ) : (
                      <User className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'assistant'
                      ? 'bg-[var(--obsidian-light)] text-white rounded-tl-sm'
                      : 'bg-[var(--verde)] text-black rounded-tr-sm'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                      {message.content.split('\n').map((line, i) => {
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-bold text-[var(--verde)]">{part.slice(2, -2)}</strong>;
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center">
                    <Bot className="h-4 w-4 text-black" />
                  </div>
                  <div className="bg-[var(--obsidian-light)] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-[var(--verde)] animate-spin" />
                      <span className="text-sm text-white/50">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-[var(--obsidian-lighter)] flex gap-2 overflow-x-auto">
              {['Cap status', 'DP slots', 'Top scorers', 'Can we sign...?'].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1 rounded-full bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-xs text-white/70 hover:text-white hover:border-[var(--verde)] whitespace-nowrap transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--obsidian-lighter)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about roster, cap, signings..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-white placeholder:text-white/40 focus:border-[var(--verde)] focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-[var(--verde)] text-black font-semibold hover:bg-[var(--verde-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
