import React from 'react';
import { Scheme } from '../types';

interface ArchiveCardProps {
  scheme: Scheme;
  onClick: () => void;
}

const getCardImageSrc = (src: string) => {
  if (!src) return '';
  if (process.env.STATIC_DATA_ENABLED === 'true' || src.startsWith('/')) return src;
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=640&q=75`;
};

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ scheme, onClick }) => {
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
    : (scheme.archiveType || scheme.industry || 'General');

  const brandDisplay = scheme.platform || scheme.brand || "ThinkPPT";
  const ipLabel = scheme.ipName && scheme.ipName !== scheme.title ? scheme.ipName : scheme.projectType;

  return (
    <div 
      onClick={onClick}
      className="group relative mx-auto w-full max-w-[360px] cursor-pointer select-none border border-black/10 bg-[#F8F5EE] transition-colors hover:border-black/35"
    >
      <div className="flex min-h-[520px] flex-col">
         <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-black/10 bg-[#111111]">
            {/* Featured Badge */}
            {scheme.isFeatured && (
                <div className="absolute top-0 right-0 z-20">
                     <div className="bg-[#8F2F24] text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase flex items-center gap-1">
                         精选
                     </div>
                </div>
            )}
            <img
              src={getCardImageSrc(scheme.imageUrl)}
              alt={scheme.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-88 grayscale-[20%] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">{brandDisplay}</span>
              <span className="font-mono text-[10px] text-white/55">VOL.{scheme.year}</span>
            </div>
         </div>
         <div className="flex flex-1 flex-col p-5">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8F2F24]">{ipLabel}</span>
              <span className="font-mono text-[10px] text-black/35">REF.{scheme.displayId}</span>
            </div>
            <h3 className="font-heading text-2xl font-black leading-tight text-[#111111] line-clamp-2" title={scheme.title}>
              {scheme.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-black/58 line-clamp-4">{scheme.editorNote || scheme.description}</p>
            <div className="mt-5 grid grid-cols-2 border-y border-black/10 font-mono text-[10px] text-black/45">
              <div className="border-r border-black/10 py-3 pr-3">档案类型<br /><span className="font-bold text-black/75">{scheme.archiveType || scheme.category}</span></div>
              <div className="py-3 pl-3">规模<br /><span className="font-bold text-black/75">{displayPageCount} / {displayFileSize}</span></div>
            </div>
            <div className="mt-auto flex items-center justify-between pt-5">
                <span className="max-w-[170px] truncate font-mono text-[10px] uppercase tracking-widest text-black/35">{displayTags}</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8F2F24]">进入档案</span>
            </div>
         </div>
      </div>
    </div>
  );
};
