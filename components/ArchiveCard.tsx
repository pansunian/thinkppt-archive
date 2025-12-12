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
      // Mobile: w-[88%] max-w-[360px] h-[450px]
      // Desktop: md:w-full md:max-w-[290px] md:h-[400px]
      className="group relative w-[88%] max-w-[360px] md:w-full md:max-w-[290px] mx-auto h-[450px] md:h-[400px] mt-8 perspective-1000 cursor-pointer font-sans select-none"
    >
      
      {/* 2. Folder Back (The visual background) */}
      <div 
        className="absolute inset-x-0 bottom-0 top-8 rounded-xl z-0 transition-transform duration-300 group-hover:translate-y-2 shadow-sm border-2 border-transparent"
        style={{ backgroundColor: scheme.color }}
      >
        {/* The "Tab" - Distinct rounded file tab */}
        <div 
            className="absolute -top-8 left-0 w-[140px] h-9 rounded-t-xl z-0 flex items-center justify-center border-t-2 border-x-2 border-black/5"
            style={{ backgroundColor: scheme.color }}
        >
             <span className="font-mono text-[10px] font-bold opacity-50 tracking-widest text-black">
                VOL.{scheme.year}
             </span>
        </div>
      </div>

      {/* 1. The Paper Content (Main Card) */}
      <div className="absolute left-3 right-3 top-8 bottom-3 bg-white rounded-lg z-10 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-20 group-hover:shadow-xl group-hover:rotate-1 flex flex-col overflow-hidden border border-gray-200">
         
         {/* Image Area - 16:9 Aspect Ratio */}
         <div className="w-full aspect-video relative overflow-hidden bg-gray-100 shrink-0 border-b border-gray-100">
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
         {/* Texture Overlay: Subtle grain/noise for cardstock feel */}
         <div 
            className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
         ></div>

         {/* Top Bevel Highlight (Thickness) */}
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>

         {/* Content - Pushed up slightly to make room for ridges */}
         <div className="relative z-10 flex justify-between items-start opacity-70 mix-blend-multiply mt-1">
             <div className="flex flex-col">
                 <span className="font-mono text-[9px] uppercase tracking-wider mb-0.5 scale-75 origin-top-left opacity-70">Category</span>
                 <span className="font-bold text-xs font-mono uppercase tracking-wide border-b-2 border-black/10 pb-0.5">
                    {scheme.category}
                 </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] uppercase tracking-wider mb-0.5 scale-75 origin-top-right opacity-70">ID Code</span>
                <span className="font-bold text-xs font-mono tracking-tighter">{scheme.id.slice(-4).padStart(4, '0')}</span>
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
             <span className="font-black text-[3rem] leading-none opacity-[0.07] mix-blend-multiply truncate pointer-events-none w-full text-center tracking-tighter font-mono">
                 {scheme.brand}
             </span>
         </div>

      </div>

    </div>
  );
};