
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[88%] px-5 py-3.5 rounded-[1.6rem] text-[16px] leading-relaxed transition-all
        ${isUser 
          ? 'bg-[#007AFF] text-white rounded-tr-none shadow-md shadow-blue-100' 
          : 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-none shadow-sm'
        }`}
      >
        <div className="whitespace-pre-wrap font-normal tracking-tight decoration-zinc-200 underline-offset-4">{message.content}</div>
        <div className={`text-[9px] mt-2 font-bold opacity-30 uppercase tracking-[0.15em] ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
