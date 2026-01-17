'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Sample responses - In production, this would call an AI API
const getAIResponse = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  // Roster questions
  if (lowerMessage.includes('roster') && lowerMessage.includes('size')) {
    return "Austin FC currently has **13 players** on the senior roster out of a maximum of 20. There are also 8 supplemental roster spots filled out of 10 available.";
  }

  if (lowerMessage.includes('dp') || lowerMessage.includes('designated player')) {
    return "**Designated Player (DP) Rules:**\n\n• Austin FC has **1 DP** (Sebastián Driussi) out of 3 slots\n• DP budget charge: $683,750 regardless of actual salary\n• Young DP (≤23 years): Reduced charge of $150,000\n\n**2 DP slots are available** for potential signings!";
  }

  if (lowerMessage.includes('cap') || lowerMessage.includes('salary')) {
    return "**Austin FC Salary Cap Status:**\n\n• Budget: $5.27M\n• Current Spend: $4.87M\n• Cap Space: $400K\n• TAM Available: $450K\n• GAM Available: $1.2M\n\n**Total spending power: $2.05M** when combining cap space with allocation money!";
  }

  if (lowerMessage.includes('sign') && (lowerMessage.includes('can') || lowerMessage.includes('able'))) {
    return "To check if Austin FC can sign a player, I need to know:\n\n1. **Salary** - How much will they earn?\n2. **International** - Do they need an international slot?\n3. **Age** - Are they U22 eligible?\n4. **Designation** - DP, TAM, or senior roster?\n\nTry asking something like: \"Can we sign a $2M international striker?\"";
  }

  if (lowerMessage.includes('driussi')) {
    return "**Sebastián Driussi** (#10)\n\n• Position: CAM\n• Age: 28\n• Nationality: 🇦🇷 Argentina\n• Salary: $3.5M (DP)\n• Market Value: $12M\n• Contract: Through 2027\n\n**2025 Stats:** 14 goals, 8 assists in 30 appearances\n\nHe's Austin FC's most valuable player and only Designated Player!";
  }

  if (lowerMessage.includes('u22') || lowerMessage.includes('under 22')) {
    return "**U22 Initiative:**\n\n• Austin FC uses **2 of 3** U22 slots\n• Current U22 players: Guilherme Biro, Damian Las\n• Budget charge: Only $200,000\n• Max salary: $612,500\n\n**1 U22 slot available** - great for signing young talent at a reduced cap hit!";
  }

  if (lowerMessage.includes('international') || lowerMessage.includes('intl')) {
    return "**International Slots:**\n\n• Austin FC uses **6 of 8** international slots\n• **2 slots available**\n• Slots are tradeable between teams\n\nPlayers who don't need a slot: US citizens, green card holders, and homegrown players.";
  }

  if (lowerMessage.includes('top scorer') || lowerMessage.includes('goals')) {
    return "**Austin FC Top Scorers (2025):**\n\n1. Sebastián Driussi - 14 goals\n2. Maxi Urruti - 9 goals\n3. Emiliano Rigoni - 7 goals\n4. Gyasi Zardes - 5 goals\n5. Jader Obrian - 4 goals\n\nDriussi leads with 14 goals and 8 assists!";
  }

  if (lowerMessage.includes('value') || lowerMessage.includes('worth')) {
    return "**Austin FC Squad Valuation:**\n\n• Total Squad Value: **$29.6M**\n• Most Valuable: Sebastián Driussi ($12M)\n• Rising Stars: Owen Wolff ($3M), Guilherme Biro ($2.5M)\n\nThe squad is valued well above their combined salaries, indicating good value signings!";
  }

  if (lowerMessage.includes('standing') || lowerMessage.includes('rank') || lowerMessage.includes('position')) {
    return "**Austin FC 2025 Season:**\n\n• **8th place** in Western Conference\n• 45 points (12W-9D-13L)\n• Goals: 48 for, 52 against (GD: -4)\n• Just inside playoff positions!\n\nRecent form: W-D-L-W-W (trending up!)";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
    return "I can help you with Austin FC roster management! Try asking about:\n\n🏆 **Stats** - \"Who are our top scorers?\"\n💰 **Salary Cap** - \"What's our cap situation?\"\n📋 **Roster Rules** - \"Explain DP rules\"\n🔄 **Signings** - \"Can we sign a $2M player?\"\n📊 **Valuations** - \"What's Driussi worth?\"\n🌍 **Slots** - \"How many int'l slots do we have?\"\n\nJust ask anything about the roster!";
  }

  // Default response
  return "I'm your Austin FC GM assistant! I can help with:\n\n• Roster composition and player stats\n• Salary cap and allocation money\n• DP, U22, and international slot rules\n• Player valuations and signings\n\nTry asking: \"What's our cap situation?\" or \"Can we sign a DP?\"";
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! I'm your Austin FC GM assistant. Ask me anything about the roster, salary cap, or potential signings! 🌳⚽",
      timestamp: new Date(),
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] rounded-2xl bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--obsidian-lighter)] bg-gradient-to-r from-[var(--verde)]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--verde)] to-[var(--verde-dark)] flex items-center justify-center">
                  <Bot className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">GM Assistant</h3>
                  <p className="text-xs text-[var(--verde)]">Austin FC Roster Expert</p>
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
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'assistant'
                      ? 'bg-[var(--obsidian-light)] text-white rounded-tl-sm'
                      : 'bg-[var(--verde)] text-black rounded-tr-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                    <Loader2 className="h-4 w-4 text-[var(--verde)] animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--obsidian-lighter)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about roster, cap, signings..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-white placeholder:text-white/40 focus:border-[var(--verde)] focus:outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-[var(--verde)] text-black font-semibold hover:bg-[var(--verde-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Powered by Austin FC GM Lab MCP
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

