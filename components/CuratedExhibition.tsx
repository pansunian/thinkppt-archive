import React, { useState, useEffect } from 'react';
import { Collection } from '../types';

interface CuratedExhibitionProps {
  collections: Collection[];
  onSelectCollection: (collection: Collection) => void;
}

export const CuratedExhibition: React.FC<CuratedExhibitionProps> = ({ collections, onSelectCollection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate every 12 seconds (slightly longer for reading)
  useEffect(() => {
    if (collections.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 12000);
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
    }, 600); 
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-16">
      {/* Container: The "Special Issue" Document */}
      <div className="relative w-full bg-[#F3F0E6] border-2 border-black/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply z-0"></div>
        
        {/* Top Header Bar: The "Masthead" */}
        <div className="relative z-10 w-full border-b-2 border-black/80 flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-black/80">
            <div className="px-4 py-2 bg-black text-[#F3F0E6] flex items-center justify-center md:w-32 flex-shrink-0">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Special Issue</span>
            </div>
            <div className="flex-grow px-4 py-2 flex items-center justify-between bg-[#F3F0E6]">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse border border-black/20"></span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                       Curated Exhibition
                    </span>
                </div>
                <div className="font-mono text-xs font-bold text-black/60">
                    VOL. {new Date().getFullYear()} / NO.{String(currentIndex + 1).padStart(2, '0')}
                </div>
            </div>
            <div className="px-4 py-2 flex items-center justify-center md:w-32 flex-shrink-0 bg-[#E6E2D6] hover:bg-black hover:text-white transition-colors cursor-pointer" onClick={() => onSelectCollection(currentCollection)}>
                 <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Read More →</span>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 flex flex-col md:flex-row h-auto min-h-[480px]">
            
            {/* Left Column: Typography & Info */}
            <div className="w-full md:w-5/12 border-b-2 md:border-b-0 md:border-r-2 border-black/80 flex flex-col relative">
                
                {/* Decorative Stamp */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-80 mix-blend-multiply transform rotate-12">
                     <div className="w-20 h-20 rounded-full border-2 border-red-700 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-red-700 border-dashed flex items-center justify-center">
                            <span className="text-[8px] text-red-700 font-mono font-bold -rotate-12 uppercase text-center leading-tight">
                                Archive<br/>Verified
                            </span>
                        </div>
                     </div>
                </div>

                <div className={`flex-grow p-8 md:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <span className="font-serif italic text-lg text-gray-500 mb-2 block">
                        "{currentCollection.subtitle}"
                    </span>
                    
                    <h2 
                        onClick={() => onSelectCollection(currentCollection)}
                        className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[0.9] text-black mb-6 uppercase tracking-tight cursor-pointer hover:underline decoration-4 underline-offset-4 decoration-black/20 hover:decoration-red-600 transition-all"
                    >
                        {currentCollection.title}
                    </h2>

                    <div className="w-12 h-1 bg-black mb-6"></div>

                    <p className="font-sans text-sm leading-relaxed text-gray-800 line-clamp-4 md:line-clamp-none text-justify border-l-2 border-black/10 pl-4">
                        {currentCollection.description}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="bg-black text-white px-2 py-1 font-mono text-[10px] font-bold">
                            Total Archives: {currentCollection.schemeIds.length}
                        </div>
                        {currentCollection.themeColor && (
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-gray-500 uppercase">Theme:</span>
                                <div className="w-4 h-4 border border-black" style={{ backgroundColor: currentCollection.themeColor }}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Footer within Left Column */}
                <div className="border-t-2 border-black/80 h-14 flex divide-x-2 divide-black/80 mt-auto">
                    <button 
                        onClick={handlePrev}
                        className="flex-1 hover:bg-black hover:text-white transition-colors flex items-center justify-center group"
                    >
                        <span className="font-mono text-xs font-bold group-hover:-translate-x-1 transition-transform">← PREV</span>
                    </button>
                    <button 
                        onClick={handleNext}
                        className="flex-1 hover:bg-black hover:text-white transition-colors flex items-center justify-center group"
                    >
                        <span className="font-mono text-xs font-bold group-hover:translate-x-1 transition-transform">NEXT →</span>
                    </button>
                </div>
            </div>

            {/* Right Column: Visual */}
            <div className="w-full md:w-7/12 relative bg-gray-100 overflow-hidden group cursor-pointer" onClick={() => onSelectCollection(currentCollection)}>
                 {/* The Image */}
                 <div className="absolute inset-0">
                     <img 
                        src={currentCollection.coverImage} 
                        alt={currentCollection.title}
                        className={`w-full h-full object-cover grayscale-[20%] contrast-125 transition-all duration-700 ease-out ${isAnimating ? 'scale-110 blur-md grayscale' : 'scale-100 blur-0 group-hover:scale-105 group-hover:grayscale-0'}`}
                     />
                 </div>

                 {/* Grid Overlay Effect (Scan lines) */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none z-10"></div>
                 
                 {/* Inner Border Frame */}
                 <div className="absolute inset-4 border border-white/30 z-20 pointer-events-none flex flex-col justify-between">
                     <div className="flex justify-between items-start p-2">
                         <span className="text-white/80 font-mono text-[9px] uppercase tracking-widest drop-shadow-md">+ TARGET_VISUAL</span>
                         <span className="text-white/80 font-mono text-[9px] uppercase tracking-widest drop-shadow-md">REF.{currentCollection.id.toUpperCase()}</span>
                     </div>
                     <div className="flex justify-between items-end p-2">
                        <span className="text-white/80 font-mono text-[9px] uppercase tracking-widest drop-shadow-md">SCAN_MODE</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white/80"></div>
                            <div className="w-1 h-1 bg-white/80"></div>
                            <div className="w-1 h-1 bg-white/80"></div>
                        </div>
                     </div>
                 </div>

                 {/* Hover Reveal Overlay */}
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                    <div className="border-2 border-white px-6 py-3 transform scale-90 group-hover:scale-100 transition-transform">
                        <span className="text-white font-mono font-bold text-sm tracking-[0.2em] uppercase">Enter Exhibition</span>
                    </div>
                 </div>
            </div>

        </div>
      </div>

      {/* Pagination Dots (Outside the container) */}
      <div className="flex justify-center gap-2 mt-4">
        {collections.map((_, idx) => (
            <button 
                key={idx}
                onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setTimeout(() => {
                        setCurrentIndex(idx);
                        setIsAnimating(false);
                    }, 500);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 bg-black' : 'w-2 bg-black/20 hover:bg-black/40'}`}
            />
        ))}
      </div>
    </section>
  );
};
