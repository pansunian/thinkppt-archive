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
      // Changed: Added max-w-[290px] and mx-auto to narrow the card and center it
      className="group relative w-full max-w-[290px] mx-auto h-[420px] mt-8 perspective-1000 cursor-pointer font-sans"
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
                VOL.{scheme.year} // {scheme.id.slice(-3).padStart(3,'0')}
             </span>
        </div>
      </div>

      {/* 1. The Paper Content (Main Card) */}
      <div className="absolute left-3 right-3 top-8 bottom-3 bg-white rounded-lg z-10 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-20 group-hover:shadow-xl group-hover:rotate-1 flex flex-col overflow-hidden border border-gray-200">
         
         {/* Image Area */}
         <div className="h-60 w-full relative overflow-hidden bg-gray-100 shrink-0 border-b border-gray-100">
            <img 
                src={scheme.imageUrl} 
                alt={scheme.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
         </div>

         {/* Text Info */}
         <div className="p-5 flex flex-col h-full bg-white">
            <h3 className="font-bold text-xl leading-snug text-gray-900 line-clamp-2 font-main tracking-tight">
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
                    View Details →
                 </span>
            </div>
         </div>
      </div>

      {/* 3. Folder Front Pocket (Low profile) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[100px] rounded-b-xl z-20 pointer-events-none flex flex-col justify-end p-5 border-t border-white/30 shadow-[0_-1px_2px_rgba(0,0,0,0.02)]"
        style={{ backgroundColor: scheme.color }}
      >
         <div className="absolute top-0 left-0 right-0 h-px bg-white/40"></div>
         
         <div className="flex justify-between items-end opacity-60 mix-blend-multiply">
             <div className="flex flex-col">
                 <span className="font-mono text-[9px] uppercase tracking-wider mb-1">Category</span>
                 <span className="font-bold text-xs font-mono uppercase tracking-wide border-b border-black/20 pb-0.5">
                    {scheme.category}
                 </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] uppercase tracking-wider mb-1">Client</span>
                <span className="font-bold text-xs font-mono">{scheme.brand}</span>
             </div>
         </div>
      </div>

    </div>
  );
};