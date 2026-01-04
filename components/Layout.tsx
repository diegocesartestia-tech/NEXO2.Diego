
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  aiName: string;
  onWhatsAppExport?: () => void;
  onEditName?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, aiName, onWhatsAppExport, onEditName }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nexo - Clareza Mental',
          text: 'Estou testando uma ferramenta de clareza mental bem legal.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F2F2F7] overflow-x-hidden font-sans">
      <div className="w-full max-w-md h-[100dvh] flex flex-col bg-white relative shadow-2xl overflow-hidden">
        
        {/* Header */}
        <header className="glass-effect sticky top-0 z-30 px-5 py-4 flex items-center justify-between border-b border-zinc-100/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <div 
              onClick={onEditName}
              className="cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-zinc-900 leading-tight group-hover:text-zinc-500 transition-colors">
                  {aiName}
                </h1>
                <svg className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Ativo agora</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onWhatsAppExport}
            className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-hidden relative flex flex-col bg-[#F9F9FB]">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-col items-center">
          <p className="text-[10px] text-zinc-400 text-center leading-tight max-w-[280px]">
            Nexo • Espaço de clareza mental. Crise? Ligue <strong>188 (CVV)</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
