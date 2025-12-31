import React, { useState, useEffect } from 'react';
import { Collection } from '../types';

interface CuratedExhibitionProps {
  collections: Collection[];
  onSelectCollection: (collection: Collection) => void;
}

export const CuratedExhibition: React.FC<CuratedExhibitionProps> = ({ collections, onSelectCollection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex, collections.length]);

  if (!collections || collections.length === 0) return null;

  const currentCollection = collections[currentIndex];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % collections.length);
      setIsAnimating(false);
    }, 500); 
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-12">
      {/* Exhibition Container */}
      <div className="relative bg-white border border-black/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
        
        {/* Background Texture & Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl mix-blend-multiply"></div>
        
        {/* Header Bar */}
        <div className="relative z-10 flex justify-between items-center border-b border-black/5 px-6 py-3 bg-[#F9F7F2]">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                ThinkPPT Curated / 专题策展
             </span>
          </div>
          <div className="font-mono text-[10px] text-black/40">
             EXHIBITION {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {collections.length < 10 ? `0${collections.length}` : collections.length}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row h-auto md:h-[420px]">
          
          {/* Left: Info Panel */}
          <div className="w-full md:w-5/12 p-8 md:p-10 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-black/5 bg-[#F9F7F2]/50">
             
             {/* Transition Wrapper */}
             <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="mb-6">
                  <span className="inline-block px-2 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest mb-3">
                    Collection Vol.{currentIndex + 1}
                  </span>
                  <h2 
                    className="text-3xl md:text-4xl font-heading font-black leading-[0.95] text-gray-900 mb-2 cursor-pointer hover:underline decoration-2 underline-offset-4"
                    onClick={() => onSelectCollection(currentCollection)}
                  >
                    {currentCollection.title}
                  </h2>
                  <h3 className="font-serif italic text-lg text-gray-400 mb-4">{currentCollection.subtitle}</h3>
                </div>

                {/* Curator's Note */}
                <div className="relative pl-5 border-l-2 border-black/20 mb-8">
                  <p className="font-sans text-gray-600 text-sm md:text-sm leading-relaxed line-clamp-4">
                    {currentCollection.description}
                  </p>
                  <span className="block mt-2 font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                    — Curator's Note
                  </span>
                </div>

                {/* Meta & Action */}
                <div className="flex items-center gap-6 mt-auto">
                   <button 
                     onClick={() => onSelectCollection(currentCollection)}
                     className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
                   >
                     Enter Exhibition
                     <span className="group-hover:translate-x-1 transition-transform">→</span>
                   </button>
                   <div className="h-px flex-1 bg-black/10"></div>
                   <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-gray-500 font-bold">{currentCollection.schemeIds.length}</span>
                      <span className="font-mono text-[10px] text-gray-400">ARCHIVES</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Visual Projection */}
          <div className="w-full md:w-7/12 relative bg-[#1a1a1a] overflow-hidden group cursor-pointer" onClick={() => onSelectCollection(currentCollection)}>
             {/* Image */}
             <img 
               src={currentCollection.coverImage} 
               alt={currentCollection.title}
               className={`w-full h-full object-cover opacity-90 mix-blend-normal transition-all duration-700 ease-in-out transform ${isAnimating ? 'scale-110 blur-sm opacity-50' : 'scale-100 blur-0 opacity-100 group-hover:scale-105'}`}
             />
             
             {/* Dark Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
             
             {/* Overlay Text/Decor */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/30 px-6 py-4 backdrop-blur-sm bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-mono text-xs tracking-[0.2em] uppercase">点击查看合辑内容</span>
             </div>

             {/* Navigation Controls */}
             <div className="absolute bottom-0 right-0 flex border-t border-l border-white/10 bg-black/40 backdrop-blur-sm z-20" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={handlePrev}
                  className="w-14 h-14 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-r border-white/10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-14 h-14 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};