import React from 'react';
import { Scheme } from '../types';

interface ArchiveCardProps {
  scheme: Scheme;
  onClick: () => void;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ scheme, onClick }) => {
  return (
    <div 
      onClick={onClick}
      // Mobile: w-[94%] max-w-[380px] h-[440px]
      // Desktop: md:w-full md:max-w-[290px] md:h-[400px]
      className="group relative w-[94%] max-w-[380px] md:w-full md:max-w-[290px] mx-auto h-[440px] md:h-[400px] mt-8 perspective-1000 cursor-pointer font-sans select-none"
    >
      
      {/* 2. Folder Back (The visual background) */}
      <div 
        className="absolute inset-x-0 bottom-0 top-8 rounded-b-xl rounded-t-xl z-0 transition-transform duration-300 group-hover:translate-y-2 shadow-sm"
        style={{ backgroundColor: scheme.color }}
      >
        {/* The Custom Shape Tab - SVG implementation for simple rounded tab */}
        {/* UPDATED: Shifted tab to left-[2px] (moved right 1px) and -top-[31px] */}
        <div className="absolute -top-[31px] left-[2px] w-[100px] h-[36px] z-0">
             <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-full text-current" style={{ color: scheme.color }}>
                {/* 
                    Tab Shape Path (Simple Rounded):
                    - 12px radius corners
                    - Straight vertical sides
                */}
                <path 
                   d="M0,36 L0,12 C0,5 5,0 12,0 L88,0 C95,0 100,5 100,12 L100,36 Z" 
                   fill="currentColor"
                />
                {/* REMOVED STROKE PATH as requested */}
             </svg>
             
             {/* Text Label */}
             {/* UPDATED: pt-2 (8px) changed to pt-[6px] to move text up by 2px */}
             <div className="absolute inset-0 flex items-center justify-center pt-[6px]">
                 <span className="font-mono text-[10px] font-bold opacity-60 tracking-widest text-black whitespace-nowrap">
                    VOL.{scheme.year}
                 </span>
             </div>
        </div>
      </div>

      {/* 1. The Paper Content (Main Card) */}
      <div className="absolute left-3 right-3 top-8 bottom-3 bg-white rounded-lg z-10 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-20 group-hover:shadow-xl group-hover:rotate-1 flex flex-col overflow-hidden">
         
         {/* Image Area - 16:9 Aspect Ratio */}
         <div className="w-full aspect-video relative overflow-hidden bg-gray-100 shrink-0">
            <img 
                src={scheme.imageUrl} 
                alt={scheme.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
         </div>

         {/* Text Info */}
         <div className="p-5 flex flex-col h-full bg-white">
            <h3 className="font-bold text-xl leading-snug text-gray-900 line-clamp-2 font-heading tracking-tight">
                {scheme.title}
            </h3>
            
            <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-medium">
                    {scheme.description}
                </p>
            </div>
            
            <div className="mt-auto pt-2 flex items-center justify-between">
                 <div className="flex gap-1">
                    {scheme.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">
                            {tag}
                        </span>
                    ))}
                 </div>
                 <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">
                    查看详情 →
                 </span>
            </div>
         </div>
      </div>

      {/* 3. Folder Front Pocket (Low profile with Texture and Lines) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[110px] rounded-b-xl rounded-t-2xl z-20 pointer-events-none flex flex-col justify-start p-5 border-t border-white/40 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] overflow-hidden"
        style={{ backgroundColor: scheme.color }}
      >
         {/* LIGHTENING OVERLAY: Added to create contrast with the back folder */}
         <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>

         {/* Texture Overlay: Subtle grain/noise for cardstock feel */}
         <div 
            className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
         ></div>

         {/* Top Bevel Highlight (Thickness) */}
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>

         {/* Content - Removed opacity-70 and mix-blend-multiply from the text container to improve clarity on colored backgrounds */}
         <div className="relative z-10 flex justify-between items-start mt-1 text-black/70">
             <div className="flex flex-col">
                 <span className="font-mono text-[9px] uppercase tracking-wider mb-0.5 scale-75 origin-top-left">Category</span>
                 <span className="font-bold text-xs font-mono uppercase tracking-wide border-b-2 border-black/10 pb-0.5">
                    {scheme.category}
                 </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] uppercase tracking-wider mb-0.5 scale-75 origin-top-right">ID Code</span>
                {/* UPDATED: Uses displayId from Notion property instead of UUID slice */}
                <span className="font-bold text-xs font-mono tracking-tighter">{scheme.displayId}</span>
             </div>
         </div>

         {/* DECORATIVE: Embossed Ridges / Lines at the bottom */}
         <div className="absolute bottom-0 left-0 right-0 flex flex-col z-0">
            {/* Ridge 1 */}
            <div className="h-[3px] w-full bg-black/5 border-b border-white/20 mb-[3px]"></div>
            {/* Ridge 2 */}
            <div className="h-[3px] w-full bg-black/5 border-b border-white/20 mb-[3px]"></div>
            {/* Ridge 3 */}
            <div className="h-[3px] w-full bg-black/5 border-b border-white/20 mb-[12px]"></div>
         </div>

         {/* Client Name Overlay on top of ridges (optional style) or above */}
         <div className="absolute bottom-4 left-5 right-5 z-10 flex justify-center">
             <span className="font-black text-[3rem] leading-none opacity-[0.08] mix-blend-multiply truncate pointer-events-none w-full text-center tracking-tighter font-mono">
                 {scheme.brand}
             </span>
         </div>

      </div>

    </div>
  );
};