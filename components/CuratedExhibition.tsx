import React, { useState, useEffect } from 'react';
import { Collection } from '../types';

interface CuratedExhibitionProps {
  collections: Collection[];
  onSelectCollection: (collection: Collection) => void;
}

export const CuratedExhibition: React.FC<CuratedExhibitionProps> = ({ collections, onSelectCollection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate disabled for better manual exploration experience
  useEffect(() => {
    if (collections.length <= 1) return;
    const timer = setInterval(() => {
       // handleNext(); // Optional: uncomment to enable auto-slide
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex, collections.length]);

  if (!collections || collections.length === 0) return null;

  const currentCollection = collections[currentIndex];

  const handleSelect = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  // Kraft / Archive Bag Style Constants
  const KRAFT_BG = '#D8CBB7'; 

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10 font-sans select-none mt-8">
       
       {/* 
          Main Container: The Kraft Archive Envelope 
          - Box shadow gives it depth off the page.
          - Color is typical manila/kraft folder.
       */}
       <div className="relative w-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] rounded-[2px]" style={{ backgroundColor: KRAFT_BG }}>
          
          {/* Texture Overlay: Dirty Paper / Fiber effect */}
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] rounded-[2px]"></div>

          {/* Top Flap Shadow Gradient: Gives illusion of volume at the top fold */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent z-10 rounded-t-[2px]"></div>

          {/* Flex Container: Left Content | Right Image */}
          <div className="relative flex flex-col md:flex-row min-h-[460px] md:h-[480px]">
              
              {/* --- LEFT SIDE: Info & Closure --- */}
              <div className="relative w-full md:w-[45%] p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black/10">
                  
                  {/* Stamp: Confidential */}
                  <div className="absolute top-6 left-8 opacity-60 mix-blend-multiply pointer-events-none">
                      <div className="border-2 border-red-900 text-red-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] -rotate-3 ink-stamp">
                          Confidential
                      </div>
                  </div>

                  {/* Visual: String & Button Closure (The "Archive Bag" look) */}
                  {/* Positioned on the right edge of the left panel to simulate closure mechanism */}
                  <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-12">
                      {/* Top Button */}
                      <div className="w-6 h-6 rounded-full bg-[#E6DCC9] shadow-[1px_2px_3px_rgba(0,0,0,0.3)] border border-[#C5B49A] flex items-center justify-center relative">
                          <div className="w-1.5 h-1.5 bg-[#8B7D6B] rounded-full"></div>
                      </div>
                      
                      {/* The String */}
                      <div className="absolute top-3 w-[2px] bg-[#EBE3D5] shadow-sm z-0" style={{ height: 'calc(100% - 6px)', top: '12px', boxShadow: '1px 0 2px rgba(0,0,0,0.1)' }}></div>
                      
                      {/* Bottom Button */}
                       <div className="w-6 h-6 rounded-full bg-[#E6DCC9] shadow-[1px_2px_3px_rgba(0,0,0,0.3)] border border-[#C5B49A] flex items-center justify-center relative">
                          <div className="w-1.5 h-1.5 bg-[#8B7D6B] rounded-full"></div>
                      </div>
                  </div>

                  {/* Text Content Area */}
                  <div className={`mt-8 transition-all duration-500 ease-out ${isAnimating ? 'opacity-50 blur-[1px]' : 'opacity-100 blur-0'}`}>
                      <div className="flex items-center gap-2 mb-4">
                           <span className="font-mono text-[9px] uppercase tracking-widest text-black/40">Exhibition No.</span>
                           <span className="font-mono text-sm font-bold text-black/70 bg-black/5 px-2 py-0.5 rounded-sm">0{currentIndex + 1}</span>
                      </div>
                      
                      <h2 
                        onClick={() => onSelectCollection(currentCollection)}
                        className="font-heading font-black text-4xl md:text-5xl uppercase leading-[0.9] text-[#1A1A1A] mb-6 cursor-pointer hover:text-red-900 transition-colors tracking-tighter"
                      >
                          {currentCollection.title}
                      </h2>

                      <div className="w-full h-[1px] bg-black/10 mb-6"></div>

                      <p className="font-mono text-xs md:text-sm leading-relaxed text-[#4A4A4A] text-justify mb-8 pr-4 line-clamp-4">
                          {currentCollection.description}
                      </p>

                      <button 
                         onClick={() => onSelectCollection(currentCollection)}
                         className="group inline-flex items-center gap-3 bg-[#2A2A2A] text-[#E6DCC9] px-6 py-3 shadow-md hover:shadow-lg hover:bg-black transition-all"
                      >
                          <span className="font-bold text-xs uppercase tracking-[0.2em]">Open Archive</span>
                          <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
                      </button>
                  </div>
              </div>

              {/* --- RIGHT SIDE: Image Presentation --- */}
              <div className="relative w-full md:w-[55%] bg-[#EBE3D5] p-4 md:p-6 flex items-center justify-center overflow-hidden">
                   
                   {/* Background Elements for Right Panel */}
                   <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                   {/* The Photo attached to the file */}
                   <div 
                      className="relative w-[90%] md:w-[85%] aspect-video shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-white p-2 transform rotate-1 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group cursor-pointer hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
                      onClick={() => onSelectCollection(currentCollection)}
                   >
                       <div className="w-full h-full relative overflow-hidden bg-gray-100">
                           <img 
                               src={currentCollection.coverImage} 
                               alt={currentCollection.title} 
                               className={`w-full h-full object-cover filter contrast-[1.05] sepia-[0.1] transition-all duration-700 ${isAnimating ? 'blur-sm scale-105 grayscale' : 'blur-0 scale-100 grayscale-0'}`}
                           />
                           {/* Vignette */}
                           <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] pointer-events-none"></div>
                       </div>

                       {/* Tape Effect: Top Center */}
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 backdrop-blur-[1px] shadow-sm rotate-1 z-20 opacity-80"></div>
                   </div>

                   {/* Right Edge Tabs (Vertical Navigation) */}
                   <div className="absolute right-0 top-12 bottom-12 w-10 md:w-12 flex flex-col gap-1 z-10">
                      {collections.map((col, idx) => {
                          const isActive = idx === currentIndex;
                          return (
                              <button
                                  key={col.id}
                                  onClick={() => handleSelect(idx)}
                                  className={`
                                      flex-1 w-full rounded-l-[4px] border-l border-y border-black/10 flex items-center justify-center transition-all duration-300 relative
                                      ${isActive ? 'bg-[#D8CBB7] translate-x-[-2px] shadow-[inset_2px_0_5px_rgba(0,0,0,0.05)] z-20' : 'bg-[#E0D5C0] hover:bg-[#D8CBB7] translate-x-[4px] opacity-90'}
                                  `}
                              >
                                  <span className={`rotate-90 whitespace-nowrap font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-black/30'}`}>
                                      Vol.{idx + 1}
                                  </span>
                              </button>
                          )
                      })}
                   </div>
              </div>

          </div>

          {/* Bottom Fold Detail (Decorative) */}
          <div className="h-3 bg-black/5 border-t border-black/5 w-full rounded-b-[2px]"></div>
       </div>

    </section>
  );
};
