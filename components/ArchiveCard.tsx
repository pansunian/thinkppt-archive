import React from 'react';
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
  const displayPageCount = scheme.pageCount && scheme.pageCount !== 'N/A' 
    ? (scheme.pageCount.includes('页') ? scheme.pageCount : `${scheme.pageCount} 页`)
    : 'N/A';

  return (
    <div 
      onClick={onClick}
      className="group relative w-[94%] max-w-[380px] md:w-full md:max-w-[320px] mx-auto h-[440px] mt-20 perspective-1000 cursor-pointer select-none"
    >
      
      {/* 1. Back Folder (The Inner Plate) */}
      <div 
        className="absolute inset-0 rounded-lg shadow-lg z-0"
        style={{ backgroundColor: innerColor }}
      >
        {/* Sub-container for textures to allow the tab to stick out */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            {/* Paper Grain Overlays */}
            <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/p6-polyester.png')]"></div>
            {/* Subtle Edge Burn Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.08)]"></div>
        </div>

        {/* Tab Ear (标签耳) - Top Left, outside the overflow area */}
        <div className="absolute -top-[30px] left-0 w-[110px] h-[34px] z-[-1]">
             <svg viewBox="0 0 110 34" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm" style={{ color: innerColor }}>
                <path 
                   d="M0,34 L0,10 C0,4.5 4.5,0 10,0 L90,0 C98,0 102,6 105,14 L110,34 Z" 
                   fill="currentColor"
                />
             </svg>
             {/* Tab Content */}
             <div className="absolute inset-0 flex items-center justify-center pt-2 pr-6">
                 <span className="font-mono text-[9px] font-black opacity-30 uppercase tracking-[0.2em] text-black">
                    VOL.{scheme.year}
                 </span>
             </div>
        </div>

        {/* Left Side Stamps (Top Left Corner of the back) */}
        <div className="absolute top-12 left-6 w-16 h-16 opacity-[0.15] rotate-[-12deg] ink-stamp flex items-center justify-center pointer-events-none">
            <div className="w-full h-full border-[1.5px] border-black rounded-full flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[6px] font-bold leading-none uppercase tracking-tighter">Classified</span>
                <span className="text-[14px] font-black leading-none my-0.5 tracking-tighter">TOP</span>
                <span className="text-[5px] font-bold leading-none uppercase">ARCHIVE UNIT</span>
            </div>
        </div>
      </div>

      {/* 2. Slide-out Content (The "White" Paper) */}
      <div className="absolute inset-x-3 top-4 bottom-2 bg-white rounded shadow-sm transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:-translate-y-48 group-hover:rotate-1 z-10 flex flex-col overflow-hidden border border-gray-100">
         <div className="w-full aspect-video bg-gray-50 overflow-hidden shrink-0 border-b border-gray-100">
            <img 
                src={scheme.imageUrl} 
                alt={scheme.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
         </div>
         <div className="p-5 flex-1 relative flex flex-col">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <h3 className="font-bold text-lg leading-tight text-gray-900 mb-2 relative z-10">{scheme.title}</h3>
            <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed relative z-10">{scheme.description}</p>
            <div className="mt-auto flex justify-between items-center relative z-10 pt-2">
                <span className="text-[9px] font-mono text-gray-300 uppercase tracking-tighter">DocRef_{scheme.displayId}</span>
                <span className="text-[10px] font-bold text-black group-hover:underline">VIEW FULL →</span>
            </div>
         </div>
      </div>

      {/* 3. Front Pocket (口袋部分) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[165px] rounded-b-lg rounded-t-[24px] z-20 pointer-events-none border-t border-black/10 shadow-[0_-15px_40px_rgba(0,0,0,0.18)] overflow-hidden"
        style={{ backgroundColor: outerColor }}
      >
         {/* Texture Layers */}
         <div className="absolute inset-0 opacity-[0.3] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6-polyester.png')]"></div>
         <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
         
         {/* Top Lip Lip (Simulating Thickness) */}
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40"></div>
         <div className="absolute top-[1px] left-0 right-0 h-[4px] bg-black/5"></div>

         {/* Pocket Form Layout */}
         <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
            
            {/* Pocket Header */}
            <div className="flex justify-between items-start mb-3 border-b border-black/20 pb-1">
                <div className="flex flex-col">
                    <span className="font-mono text-[7px] uppercase font-bold text-black/40">Category</span>
                    <span className="font-bold text-[10px] font-mono uppercase text-black/70">{scheme.category}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[7px] uppercase font-bold text-black/40">Archive Code</span>
                    <span className="font-bold text-[10px] font-mono text-black/70">REF.{scheme.displayId}</span>
                </div>
            </div>

            {/* The Table Grid - Showing Page Count (with unit) and File Size */}
            <div className="w-full border border-black/20 flex flex-col font-mono text-[7px] text-black/60 mb-2">
                <div className="flex border-b border-black/20">
                    <div className="w-1/2 border-r border-black/20 p-1">方案页数: <span className="text-black/80 font-bold">{displayPageCount}</span></div>
                    <div className="w-1/2 p-1">文件大小: <span className="text-black/80 font-bold">{scheme.fileSize}</span></div>
                </div>
                <div className="flex">
                    <div className="w-1/2 border-r border-black/20 p-1">存封日期: {scheme.date}</div>
                    <div className="w-1/2 p-1">档案编号: #{scheme.displayId}</div>
                </div>
            </div>

            {/* Large Brand Text - Flush with bottom edge */}
            <div className="mt-auto relative w-full h-20 flex items-end justify-center overflow-hidden">
                <span className="font-serif text-[5rem] font-medium tracking-[0.12em] uppercase whitespace-nowrap select-none text-white/90 leading-[0.75] translate-y-[8px]">
                    {scheme.brand}
                </span>
            </div>
         </div>

         {/* Fold Line Detail */}
         <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5"></div>
      </div>

    </div>
  );
};