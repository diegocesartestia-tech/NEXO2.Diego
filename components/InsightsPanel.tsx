
import React from 'react';
import { Insight } from '../types';

interface InsightsPanelProps {
  insights: Insight[];
  onClose: () => void;
  aiName: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, onClose, aiName }) => {
  const shareToWhatsApp = () => {
    const title = `*Minha jornada hoje com ${aiName}*\n\n`;
    const body = insights.map(i => `• *${i.topic}*: ${i.description}`).join('\n\n');
    const footer = `\n\n_Reflexões geradas no Amigo Lúcido_`;
    const text = encodeURIComponent(title + body + footer);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="absolute inset-0 z-30 bg-white flex flex-col p-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Nossa Clareza</h2>
          <p className="text-xs text-zinc-400">Padrões sutis que percebemos hoje.</p>
        </div>
        <button onClick={onClose} className="text-zinc-300 hover:text-zinc-900 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-zinc-50/50 p-5 rounded-3xl border border-zinc-100">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${
                insight.sentiment === 'positive' ? 'bg-[#34C759]' :
                insight.sentiment === 'reflective' ? 'bg-[#007AFF]' : 'bg-zinc-300'
              }`} />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{insight.topic}</h3>
            </div>
            <p className="text-zinc-700 text-sm leading-relaxed">{insight.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <button 
          onClick={shareToWhatsApp}
          className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-green-100"
        >
          <span className="text-sm">Continuar no WhatsApp</span>
        </button>
        <button 
          onClick={onClose}
          className="w-full text-zinc-400 py-3 text-sm font-medium"
        >
          Voltar para a conversa
        </button>
      </div>
    </div>
  );
};

export default InsightsPanel;
