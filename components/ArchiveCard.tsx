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
  const displayPageCount = scheme.pageCount && scheme.pageCount !== 'N/A' && scheme.pageCount !== ''
    ? (scheme.pageCount.includes('页') ? scheme.pageCount : `${scheme.pageCount} 页`)
    : 'N/A';

  const displayFileSize = scheme.fileSize && scheme.fileSize !== '' ? scheme.fileSize : 'N/A';

  // 格式化标签显示，取前两个标签以防过长
  const displayTags = scheme.tags && scheme.tags.length > 0 
    ? scheme.tags.slice(0, 2).join(' ') 
    : (scheme.industry || 'General');

  // 模拟品牌文字：使用 4 个汉字“深刻策划”作为底纹示意
  const brandDisplay = "深刻策划";

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
             <div className="absolute inset-0 flex items-center justify-center pt-2 pr-6">
                 <span className="font-mono text-[9px] font-black opacity-20 uppercase tracking-[0.2em] text-black">
                    VOL.{scheme.year}
                 </span>
             </div>
        </div>
      </div>

      {/* 2. Slide-out Content (The "White" Paper) */}
      <div className="absolute inset-x-3 top-4 bottom-2 bg-white rounded shadow-md transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:-translate-y-32 group-hover:rotate-1 z-10 flex flex-col overflow-hidden">
         <div className="w-full aspect-video bg-gray-50 overflow-hidden shrink-0 border-b border-gray-100">
            <img 
                src={scheme.imageUrl} 
                alt={scheme.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
         </div>
         <div className="p-5 pb-16 flex-1 relative flex flex-col">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            <h3 className="font-bold text-lg leading-tight text-gray-900 mb-2 relative z-10">{scheme.title}</h3>
            <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed relative z-10">{scheme.description}</p>
            <div className="mt-auto flex justify-between items-center relative z-10 pt-2 border-t border-gray-50">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter truncate max-w-[150px]">{displayTags}</span>
                <span className="text-[10px] font-bold text-black group-hover:underline">查阅档案 →</span>
            </div>
         </div>
      </div>

      {/* 3. Front Pocket (口袋部分) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[165px] rounded-b-lg rounded-t-[24px] z-20 pointer-events-none border-t border-black/5 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] overflow-hidden"
        style={{ backgroundColor: outerColor }}
      >
         {/* Texture Layers */}
         <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6-polyester.png')]"></div>
         
         {/* Brand Watermark - 宋体风格、字号放大、左右居中、贴合底部 */}
         <div className="absolute inset-x-0 bottom-0 flex justify-center z-0 pointer-events-none overflow-hidden pb-0 md:pb-1">
            <span className="font-heading text-6xl md:text-7xl font-medium tracking-[0.4em] select-none text-white opacity-[0.28] whitespace-nowrap leading-none transform translate-y-[15%] pl-[0.4em]">
                {brandDisplay}
            </span>
         </div>

         {/* Pocket Form Layout - 置于 z-10 确保不被底纹遮挡 */}
         <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
            
            {/* Pocket Header */}
            <div className="flex justify-between items-start mb-3 border-b border-black/10 pb-1">
                <div className="flex flex-col">
                    <span className="font-mono text-[7px] uppercase font-bold text-black/30">Category</span>
                    <span className="font-bold text-[11px] font-mono uppercase text-black/60 tracking-tight">{scheme.category}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[7px] uppercase font-bold text-black/30">Archive Code</span>
                    <span className="font-bold text-[10px] font-mono text-black/60">REF.{scheme.displayId}</span>
                </div>
            </div>

            {/* The Table Grid */}
            <div className="w-full border border-black/10 flex flex-col font-mono text-[7px] text-black/50 mb-2 bg-black/5 backdrop-blur-[1px]">
                <div className="flex border-b border-black/10">
                    <div className="w-1/2 border-r border-black/10 p-1.5">方案页数: <span className="text-black/70 font-bold">{displayPageCount}</span></div>
                    <div className="w-1/2 p-1.5">文件大小: <span className="text-black/70 font-bold">{displayFileSize}</span></div>
                </div>
                <div className="flex">
                    <div className="w-1/2 border-r border-black/10 p-1.5">存封日期: {scheme.date}</div>
                    <div className="w-1/2 p-1.5">所属行业: <span className="text-black/70 font-bold">{scheme.industry || 'General'}</span></div>
                </div>
            </div>

            {/* Empty space for the watermark to breathe */}
            <div className="mt-auto h-12"></div>
         </div>
         
         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20"></div>
      </div>

    </div>
  );
};