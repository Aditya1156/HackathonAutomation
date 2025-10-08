import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Imported ChatMessage type from central types file and aliased it to Message to resolve type incompatibility.
import type { Team, ChatMessage as Message } from '../types';
import { ChatBubbleIcon } from './IconComponents';
import { mentorChatData } from '../services/mockData';

const DashboardChat: React.FC<{ team: Team }> = () => {
  const [messages, setMessages] = useState<Message[]>(mentorChatData);
  const [inputValue, setInputValue] = useState('');
  const [isMentorTyping, setIsMentorTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mentorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const mockMentor = { name: 'Dr. Evelyn Reed', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Evelyn' };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMentorTyping]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (mentorTimeoutRef.current) {
        clearTimeout(mentorTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = { from: 'user', text: inputValue, time: currentTime };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Clear any existing timeout
    if (mentorTimeoutRef.current) {
      clearTimeout(mentorTimeoutRef.current);
    }
    
    // Simulate mentor response
    setIsMentorTyping(true);
    mentorTimeoutRef.current = setTimeout(() => {
      const mentorResponse: Message = { from: 'mentor', text: 'That\'s a great question! Let me think about that for a moment...', time: currentTime };
      setMessages(prev => [...prev, mentorResponse]);
      setIsMentorTyping(false);
      mentorTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-[#100D1C]/50 border border-purple-800/60 rounded-xl backdrop-blur-sm">
      <div className="p-4 border-b border-purple-500/30 flex items-center space-x-3">
        <img src={mockMentor.avatarUrl} alt={mockMentor.name} className="w-12 h-12 rounded-full"/>
        <div>
            <h2 className="text-xl font-bold text-white">{mockMentor.name}</h2>
            <p className="text-sm text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                Online
            </p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'mentor' && <img src={mockMentor.avatarUrl} className="w-8 h-8 rounded-full"/>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.from === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
            {isMentorTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                    <img src={mockMentor.avatarUrl} className="w-8 h-8 rounded-full"/>
                    <div className="p-3 bg-slate-700 rounded-2xl rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-purple-500/30">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message to Dr. Reed..."
            className="flex-1 p-3 bg-slate-800/70 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg">Send</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardChat;