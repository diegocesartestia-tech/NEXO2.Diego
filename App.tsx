
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import ChatMessage from './components/ChatMessage';
import InsightsPanel from './components/InsightsPanel';
import { geminiService } from './services/geminiService';
import { Message, Insight } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  const [aiName, setAiName] = useState<string>('Nexo');
  const [userName, setUserName] = useState<string>('você');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: INITIAL_GREETING,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping, scrollToBottom]);

  const handleWhatsAppExport = () => {
    const text = encodeURIComponent(`Trocando uma ideia com o Nexo. Um papo de boa para clarear a mente.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    try {
      // Delay mais rápido para mensagens curtas
      const humanDelay = Math.floor(Math.random() * 300) + 500;
      await new Promise(resolve => setTimeout(resolve, humanDelay));
      
      let fullResponse = '';
      const stream = geminiService.sendMessageStream(messages, currentInput, aiName, userName);
      
      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
          setIsTyping(false);
          setMessages(prev => [...prev, assistantMsg]);
          firstChunk = false;
        }
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId ? { ...m, content: fullResponse } : m
        ));
      }
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "eita, deu um tilt aqui. podemos continuar?",
        timestamp: new Date()
      }]);
    }
  };

  const toggleInsights = async () => {
    if (!showInsights && messages.length > 2) {
      setIsTyping(true);
      const newInsights = await geminiService.generateInsights(messages);
      setInsights(newInsights);
      setIsTyping(false);
    }
    setShowInsights(!showInsights);
  };

  return (
    <Layout 
      aiName={aiName} 
      onWhatsAppExport={handleWhatsAppExport}
      onEditName={() => setIsEditingName(true)}
    >
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pt-5 pb-40 scrollbar-hide"
      >
        <div className="flex flex-col space-y-4 max-w-lg mx-auto">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-zinc-100 flex gap-1 items-center shadow-sm">
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s]" />
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditingName && (
        <div className="absolute inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="bg-white w-full max-w-xs p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 text-center">Como quer me chamar?</h3>
            <input 
              autoFocus
              className="w-full bg-zinc-100 p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-zinc-200 text-center"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            />
            <button 
              onClick={() => setIsEditingName(false)}
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-sm font-bold active:scale-95 transition-transform"
            >
              Feito
            </button>
          </div>
        </div>
      )}

      {!showInsights && messages.length > 2 && (
        <button 
          onClick={toggleInsights}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 bg-white/90 backdrop-blur shadow-lg border border-zinc-100 rounded-full flex items-center gap-2 active:scale-95 transition-all"
        >
          <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">resumo rápido</span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white/90 backdrop-blur-md border-t border-zinc-100/50">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="pode falar..."
            className="flex-1 bg-zinc-100 px-5 py-4 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all text-[16px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              input.trim() && !isTyping ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showInsights && (
        <InsightsPanel 
          insights={insights} 
          onClose={() => setShowInsights(false)} 
          aiName={aiName}
        />
      )}
    </Layout>
  );
};

export default App;
