import React, { useState } from 'react';
import { Scheme } from '../types';
import { PALETTE } from '../constants';

interface ArchiveCardProps {
  scheme: Scheme;
  onClick: () => void;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ scheme, onClick }) => {
  // 颜色区分：外层口袋使用 PALETTE.KRAFT_OUTER，内层背板使用 KRAFT_INNER
  const outerColor = PALETTE.KRAFT_OUTER;
  const innerColor = PALETTE.KRAFT_INNER;

  // 格式化页数显示，确保带有“页”字
  const displayPageCount = scheme.pageCount && scheme.pageCount !== 'N/A' && scheme.pageCount !== ''
    ? (scheme.pageCount.includes('页') ? scheme.pageCount : `${scheme.pageCount} 页`)
    : 'N/A';

  // 格式化文件大小，确保带有 "M"
  const displayFileSize = scheme.fileSize && scheme.fileSize !== '' 
    ? (scheme.fileSize.toUpperCase().includes('M') ? scheme.fileSize : `${scheme.fileSize}M`)
    : 'N/A';

  // 格式化标签显示，取前两个标签以防过长
  const displayTags = scheme.tags && scheme.tags.length > 0 
    ? scheme.tags.slice(0, 2).join(' ') 
    : (scheme.industry || 'General');

  // 动态调用 Brand 属性，如果没有则显示默认值
  const brandDisplay = scheme.brand || "深刻策划";

  return (
    <div 
      onClick={onClick}
      className="group relative w-[94%] max-w-[380px] md:w-full md:max-w-[320px] mx-auto h-[440px] mt-20 perspective-1000 cursor-pointer select-none overflow-visible"
      style={{ transformStyle: 'preserve-3d' }}
    >
      
      {/* 1. Back Folder (The Inner Plate) - 基础层 Z=0px */}
      <div 
        className="absolute inset-0 rounded-lg shadow-lg z-0 [transform:translate3d(0,0,0)]"
        style={{ backgroundColor: innerColor }}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            {/* Paper Grain Overlays */}
            <div className="absolute inset-0 opacity-[0.3] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)]"></div>
        </div>

        {/* Tab Ear */}
        <div className="absolute -top-[30px] left-0 w-[110px] h-[34px] z-[-1]">
             <svg viewBox="0 0 110 34" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm" style={{ color: innerColor }}>
                <path 
                   d="M0,34 L0,10 C0,4.5 4.5,0 10,0 L90,0 C98,0 102,6 105,14 L110,34 Z" 
                   fill="currentColor" 
                />
             </svg>
             {/* Tab Text */}
             <div className="absolute inset-0 flex items-center justify-center pt-1 pr-2">
                 <span className="font-mono text-[10px] text-black/40 tracking-widest uppercase transform -rotate-1">
                     VOL.{scheme.year}
                 </span>
             </div>
        </div>
      </div>

      {/* 2. Middle Content (The File) - 模拟文件本身 Z=2px */}
      <div className="absolute inset-x-4 top-2 bottom-4 bg-white shadow-sm z-[2] [transform:translate3d(0,0,2px)] rounded-sm overflow-hidden border border-gray-100">
         {/* File Content Preview Image */}
         <div className="h-2/3 w-full bg-gray-200 relative overflow-hidden">
             <img 
               src={scheme.imageUrl} 
               alt={scheme.title} 
               className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
               loading="lazy"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
         </div>
         {/* Fake Text Lines */}
         <div className="p-4 space-y-2">
             <div className="h-2 bg-gray-100 rounded w-3/4"></div>
             <div className="h-2 bg-gray-100 rounded w-full"></div>
             <div className="h-2 bg-gray-100 rounded w-5/6"></div>
         </div>
      </div>

      {/* 3. Front Cover (The "Flap") - 前盖 Z=10px -> Hover Z=40px (Opens up) */}
      <div 
        className="absolute inset-0 z-[10] origin-top transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(-12deg)_translateY(-10px)]"
      >
        {/* Cover Face */}
        <div 
            className="absolute inset-0 rounded-lg shadow-md border-t border-white/20 overflow-hidden"
            style={{ backgroundColor: outerColor }}
        >
            {/* Texture Overlays */}
            <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.08)]"></div>
            
            {/* The Cutout Window */}
            <div className="absolute top-[180px] right-0 w-[60px] h-[80px] bg-black/5 rounded-l-full border-l border-y border-white/10 blur-[1px]"></div>

            {/* Content Layout */}
            <div className="p-5 pt-8 relative z-10 flex flex-col h-full">
                
                {/* Header Metadata */}
                <div className="flex justify-between items-start border-b-2 border-dashed border-black/10 pb-4 mb-4">
                     <div className="flex flex-col">
                         <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Project_ID</span>
                         <span className="font-mono text-xs font-bold text-gray-700 bg-white/50 px-1 rounded">{scheme.displayId}</span>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Date</span>
                         <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            <span className="font-mono text-[10px] text-gray-600">{scheme.date}</span>
                         </div>
                     </div>
                </div>

                {/* Tags */}
                <div className="mb-2">
                   <span className="inline-block px-2 py-0.5 border border-black/20 rounded-full text-[9px] font-mono font-bold text-gray-600 uppercase tracking-wider bg-white/30 backdrop-blur-sm">
                      {displayTags}
                   </span>
                </div>

                {/* Title - Increased from text-sm to text-xl */}
                <h3 className="font-heading font-bold text-xl leading-tight text-gray-900 mb-2 relative z-10">
                  {scheme.title}
                </h3>

                {/* Description (Truncated) */}
                <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-3 opacity-80 mb-auto">
                    {scheme.description}
                </p>

                {/* Footer Info (Brand & Specs) */}
                <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Client</span>
                        <span className="font-bold text-xs text-gray-800 mt-0.5 truncate max-w-[120px]">{brandDisplay}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        {displayPageCount !== 'N/A' && (
                            <div className="flex flex-col items-end">
                                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Pgs</span>
                                <span className="font-mono text-[10px] font-bold text-gray-600">{displayPageCount}</span>
                            </div>
                        )}
                        {displayFileSize !== 'N/A' && (
                            <div className="flex flex-col items-end">
                                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Size</span>
                                <span className="font-mono text-[10px] font-bold text-gray-600">{displayFileSize}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stamp Decoration */}
                <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-700/20 rounded-full flex items-center justify-center transform -rotate-12 pointer-events-none opacity-40 mix-blend-multiply">
                    <span className="text-[8px] font-black text-red-800/30 uppercase tracking-widest text-center leading-none">
                        Think<br/>Approved
                    </span>
                </div>

            </div>
        </div>
      </div>

    </div>
  );
};