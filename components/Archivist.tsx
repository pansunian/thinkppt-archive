import React, { useState } from 'react';
import { generateSchemeOutline } from '../services/geminiService';
import { GeneratedOutline } from '../types';

export const Archivist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedOutline | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    const outline = await generateSchemeOutline(query);
    setResult(outline);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Action Button - The "Librarian Bell" */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-2"
      >
        <div className="bg-[#FF4D4D] text-black border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#000] transition-all rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <span className="bg-black text-white text-xs font-mono px-2 py-1 rounded hidden group-hover:block absolute right-full mr-2 whitespace-nowrap">
            呼叫 AI 档案员
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F3F0E6] w-full max-w-lg border-2 border-black shadow-[8px_8px_0px_0px_#fff] relative flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="bg-black text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
                  AI_档案员_V1.0
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-red-500 font-mono text-xl leading-none"
              >
                [X]
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <p className="font-mono text-sm mb-4 text-gray-700">
                // SYSTEM: 正在监听... <br/>
                请输入您想要制作的 PPT 主题，我将为您调取相关的结构大纲。
              </p>

              <form onSubmit={handleAsk} className="flex gap-0 mb-6 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="例如：极简风咖啡店商业计划书..."
                  className="flex-1 border-2 border-black p-3 font-mono text-sm focus:outline-none bg-white placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-black text-white border-y-2 border-r-2 border-black px-6 font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? '检索中...' : '生成'}
                </button>
              </form>

              {/* API Indicator */}
              <div className="text-[10px] font-mono text-gray-400 text-center mb-4 uppercase tracking-wider flex items-center justify-center gap-1">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                 Powered by Google Gemini
              </div>

              {/* Result Ticket */}
              {result && (
                <div className="bg-white border border-black p-0 relative shadow-md transform rotate-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Ticket Header */}
                  <div className="border-b border-black p-2 bg-gray-50 flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase text-gray-500">TICKET-NO. {Math.floor(Math.random() * 1000)}</span>
                    <span className="font-mono text-[10px] uppercase text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-4 text-center border-b-2 border-dotted border-black pb-2">
                        {result.title}
                    </h3>
                    
                    <ul className="space-y-3 font-mono text-sm">
                        {result.sections.map((sec, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                            </span>
                            <span>{sec}</span>
                        </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div className="h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)] opacity-20 border-t border-black"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};