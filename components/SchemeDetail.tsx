import React, { useEffect, useState } from 'react';
import { Scheme } from '../types';

interface SchemeDetailProps {
  scheme: Scheme;
  onClose: () => void;
}

export const SchemeDetail: React.FC<SchemeDetailProps> = ({ scheme, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${mounted ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent invisible'}`}>
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Modal Wrapper - Now acts as the frame */}
      <div 
        className={`relative w-full max-w-4xl bg-[#FDFBF7] h-[90vh] shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
      >
        
        {/* Floating Close Button - Stays fixed relative to the modal frame */}
        <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors shadow-sm"
            >
              ✕
            </button>
        </div>

        {/* Unified Scroll Container: Image and Content scroll together */}
        <div className="w-full h-full overflow-y-auto custom-scrollbar bg-white">
            
            {/* 1. Hero Image Section (Scrolls away) */}
            <div className="w-full relative bg-gray-100 border-b-2 border-black">
                <div className="aspect-video w-full relative overflow-hidden">
                    <img 
                        src={scheme.imageUrl} 
                        alt={scheme.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Badge */}
                <div 
                    className="absolute bottom-6 left-6 px-4 py-2 border-2 border-black rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold text-black"
                    style={{ backgroundColor: scheme.color }}
                >
                    {scheme.category}
                </div>
            </div>

            {/* 2. Content Body Section */}
            <div className="relative">
                {/* Content Header */}
                <div className="p-8 pb-0">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-gray-400">REF: {scheme.id.slice(-6).toUpperCase()}</span>
                        <span className="font-mono text-xs text-gray-400">{scheme.date}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 leading-tight text-gray-900">
                    {scheme.title}
                    </h1>

                    {/* Meta Data Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <div>
                            <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Brand / Client</span>
                            <span className="font-bold text-sm block truncate">{scheme.brand}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Industry</span>
                            <span className="font-bold text-sm block truncate">{scheme.industry}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4 mt-2 md:mt-0 flex items-center">
                            <div>
                                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Year</span>
                                <span className="font-bold text-xs bg-black text-white px-2 py-1 rounded inline-block">VOL. {scheme.year}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                    {scheme.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold font-mono rounded-full border border-gray-200">
                        {tag}
                        </span>
                    ))}
                    </div>
                </div>

                {/* Body Text */}
                <div className="p-8 space-y-8 pb-16">
                    
                    {/* Description */}
                    <section>
                    <h3 className="font-mono text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        Project Brief
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-gray-800 font-sans max-w-3xl">
                        {scheme.description}
                    </p>
                    </section>

                    {/* Highlights */}
                    <section className="bg-[#FDFBF7] p-6 rounded-xl border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <h3 className="font-mono text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">// Scheme Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                        {['Market Analysis & Trends', 'Value Proposition Design', 'Strategic Roadmap (3Y)', 'Financial Modeling'].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded border border-black text-black flex items-center justify-center text-[10px] font-mono font-bold bg-white">
                                    {idx + 1}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item}</span>
                            </li>
                        ))}
                        </ul>
                    </section>

                    {/* Download Action */}
                    <section className="pt-4 pb-8 border-t border-dashed border-gray-200 mt-8">
                        <div className="flex flex-col items-center justify-center text-center mb-6">
                            <h3 className="font-black text-2xl uppercase mb-2">Ready to use?</h3>
                            <p className="text-gray-500 text-sm max-w-md">Get full access to the source file and presentation structure.</p>
                        </div>
                        {scheme.downloadUrl ? (
                            <a 
                                href={scheme.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative block w-full max-w-md mx-auto"
                            >
                                <div className="absolute inset-0 bg-black rounded-lg translate-y-1 translate-x-1 transition-transform group-hover:translate-y-2 group-hover:translate-x-2"></div>
                                <div className="relative w-full py-4 bg-[#FFDAC1] border-2 border-black rounded-lg text-black font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all flex items-center justify-center gap-2">
                                    <span>Download Source File</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </div>
                            </a>
                        ) : (
                            <button disabled className="w-full max-w-md mx-auto block py-4 bg-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest cursor-not-allowed rounded-lg border border-gray-200">
                                No Download Available
                            </button>
                        )}
                        <p className="text-center mt-3 text-[10px] text-gray-400 font-mono">
                            SECURE LINK • THINKPPT ARCHIVE
                        </p>
                    </section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};