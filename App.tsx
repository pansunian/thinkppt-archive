
import React, { useState, useEffect } from 'react';
import { ArchiveCard } from './components/ArchiveCard';
import { Archivist } from './components/Archivist';
import { SchemeDetail } from './components/SchemeDetail';
import { CATEGORIES as DEFAULT_CATEGORIES, MOCK_SCHEMES, PALETTE } from './constants';
import { Scheme } from './types';
import { mapNotionResultToSchemes } from './utils/notionMapper';

// --- CONFIGURATION START ---

interface ResourceLink {
  label: string;
  type: string;
  href?: string;
  color: string;
  id?: string;
}

const RESOURCE_LINKS: ResourceLink[] = [
  { 
    label: 'AI', 
    type: 'database', 
    id: process.env.NOTION_DB_AI_ID, 
    color: '#FFF6BD' 
  },
  { 
    label: '关于', 
    type: 'page', 
    id: process.env.NOTION_PAGE_ABOUT_ID, 
    color: '#e5e7eb' 
  },
  { 
    label: '订阅', 
    type: 'page', 
    id: process.env.NOTION_PAGE_SUBSCRIBE_ID, 
    color: '#A2D2FF' 
  }
];

const BRAND_CONFIG = {
  mode: 'image', 
  text: 'ThinkPPT',
  logoUrl: '/logo.png',
  heightClass: 'h-8' 
};

// --- CONFIGURATION END ---

const SkeletonCard = () => (
  <div className="relative w-full aspect-[3/4] md:aspect-[3/4.2] mx-auto mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
    <div className="w-full aspect-video bg-gray-200 animate-pulse"></div>
    <div className="p-5 flex flex-col flex-grow space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse"></div>
      </div>
      <div className="mt-auto flex gap-2">
        <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [isSealed, setIsSealed] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [overlayLogoError, setOverlayLogoError] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('全部');
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [currentDatabaseId, setCurrentDatabaseId] = useState<string | null>(null);
  const [currentDatabaseLabel, setCurrentDatabaseLabel] = useState('方案');
  
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!isSealed) {
        const timer = setTimeout(() => {
            setShowOverlay(false);
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [isSealed]);

  const getDrawerNumber = () => {
    if (currentDatabaseId === process.env.NOTION_DB_AI_ID) return '02';
    const idx = categories.indexOf(activeCategory);
    if (idx === -1) return '01';
    return (idx + 1).toString().padStart(2, '0');
  };

  const fetchSchemes = async (cursor: string | null = null, categoryOverride?: string, dbIdOverride?: string | null) => {
    try {
      const currentCategory = categoryOverride !== undefined ? categoryOverride : activeCategory;
      const targetDbId = dbIdOverride !== undefined ? dbIdOverride : currentDatabaseId;
      if (cursor) setLoadingMore(true); else setLoading(true);

      // EdgeOne API endpoint - ensures relative calls
      let url = `/api/schemes`;
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      if (currentCategory && currentCategory !== '全部') params.append('category', currentCategory);
      if (targetDbId) params.append('db_id', targetDbId);

      const res = await fetch(`${url}?${params.toString()}`);
      if (!res.ok) {
           console.warn(`[API] 无法从服务器获取数据 (${res.status})。可能是边缘函数未配置或路径错误。使用演示数据。`);
           setSchemes(MOCK_SCHEMES); setCategories(DEFAULT_CATEGORIES); setUseMock(true);
      } else {
           const data = await res.json();
           const mappedData = mapNotionResultToSchemes(data);
           if (!cursor && data.categories) setCategories(data.categories);
           if (cursor) setSchemes(prev => [...prev, ...mappedData]);
           else { setSchemes(mappedData); setUseMock(false); }
           setNextCursor(data.next_cursor);
           setHasMore(data.has_more);
      }
    } catch (error) {
      console.error("[API Error]", error);
      setSchemes(MOCK_SCHEMES); setCategories(DEFAULT_CATEGORIES); setUseMock(true);
    } finally { setLoading(false); setLoadingMore(false); }
  };

  const fetchAndOpenPage = async (pageId: string) => {
      try {
          const res = await fetch(`/api/page?id=${pageId}`);
          if (res.ok) {
              const pageData = await res.json();
              const mapped = mapNotionResultToSchemes({ results: [pageData] });
              if (mapped.length > 0) setSelectedScheme(mapped[0]);
          }
      } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSchemes(); }, []);

  const handleCategoryChange = (category: string) => {
      if (category === '全部' && currentDatabaseId !== null) { handleReturnToMainDb(); return; }
      if (activeCategory === category) return;
      setActiveCategory(category);
      setSchemes([]); setNextCursor(null); setHasMore(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchSchemes(null, category);
  };

  const handleReturnToMainDb = () => {
     setCurrentDatabaseId(null); setCurrentDatabaseLabel('方案');
     setActiveCategory('全部'); setSchemes([]); setNextCursor(null); setHasMore(false);
     window.scrollTo({ top: 0, behavior: 'smooth' });
     fetchSchemes(null, '全部', null);
  };
  
  const handleResourceClick = (resource: ResourceLink) => {
      if (resource.type === 'database' && resource.id) {
          setCurrentDatabaseId(resource.id); setCurrentDatabaseLabel(resource.label); 
          setActiveCategory('全部'); setSchemes([]); setNextCursor(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          fetchSchemes(null, '全部', resource.id);
      } else if (resource.type === 'page' && resource.id) {
          fetchAndOpenPage(resource.id);
      }
  };

  const displayedSchemes = useMock 
    ? (activeCategory === '全部' ? schemes : schemes.filter(s => s.category === activeCategory))
    : schemes;

  return (
    <div className="min-h-[100dvh] bg-transparent md:bg-[#e8e4da] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden flex flex-col">
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .archive-bag-shadow { box-shadow: 0 40px 80px -20px rgba(0,0,0,0.3); }
        .archive-flap-shadow { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15)); }
      `}</style>

      {/* =========================================================================
          1. LOADING OVERLAY (ARCHIVE BAG STYLE)
         ========================================================================= */}
      {showOverlay && (
        <div 
            onClick={() => setIsSealed(false)} 
            className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#f7f7f7] transition-opacity duration-500 ${!isSealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            {/* 档案袋容器 */}
            <div className={`relative w-[340px] h-[260px] md:w-[480px] md:h-[360px] bg-[#007064] rounded-[8px] archive-bag-shadow flex flex-col items-center transition-transform duration-500 cursor-pointer`}>
                
                {/* 倒梯形封盖 (Flap) */}
                <div className="absolute top-0 left-0 right-0 h-[32%] z-30 archive-flap-shadow pointer-events-none">
                    <svg viewBox="0 0 480 112" preserveAspectRatio="none" className="w-full h-full fill-[#008375]">
                        <path d="M0,0 L480,0 L480,0 L455,95 Q450,112 430,112 L50,112 Q30,112 25,95 L0,0 Z" />
                    </svg>
                </div>

                {/* 背景装饰：顶部的文案 */}
                <div className="absolute top-8 md:top-12 z-40 pointer-events-none w-full text-center px-4">
                    <span className="text-[10px] md:text-xs text-white/50 font-medium tracking-[0.2em] uppercase italic">Curator's Archive / 策划人的方案库</span>
                </div>

                {/* 封口圆扣 (稍微上移，避免遮挡 Logo) */}
                <div className="absolute top-[18%] md:top-[20%] left-0 right-0 flex flex-col items-center z-40 pointer-events-none">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#f0f0f0] rounded-full border border-black/5 flex items-center justify-center shadow-md">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="w-[1.5px] h-8 md:h-12 bg-white/60"></div>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#f0f0f0] rounded-full border border-black/5 flex items-center justify-center shadow-md -mt-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>

                {/* 中央主内容：垂直排列，彻底解决错乱 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pt-20 md:pt-28 pointer-events-none">
                    
                    {/* Logo 区域 */}
                    <div className="flex flex-col items-center mb-6">
                        {BRAND_CONFIG.mode === 'image' && !overlayLogoError ? (
                            <img 
                                src={BRAND_CONFIG.logoUrl} 
                                alt={BRAND_CONFIG.text} 
                                className="h-10 md:h-16 w-auto object-contain brightness-0 invert" 
                                onError={() => setOverlayLogoError(true)}
                            />
                        ) : (
                            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white">
                                {BRAND_CONFIG.text}
                            </h1>
                        )}
                    </div>

                    {/* 翻阅指引 (核心交互文案) */}
                    <div className="mb-4">
                        <span className="text-[12px] md:text-sm font-bold tracking-[1.2em] text-white/50 uppercase ml-[1.2em]">
                            翻阅档案
                        </span>
                    </div>

                    {/* 副标题 */}
                    <div>
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.6em] text-white/80 uppercase ml-[0.6em]">
                            〔 深刻PPT 〕
                        </span>
                    </div>
                </div>
                
                {/* 档案袋内部装饰性线条 */}
                <div className="absolute inset-0 border border-white/5 rounded-[8px] pointer-events-none"></div>
            </div>
            
            {/* 背景底层提示文字 */}
            <div className={`absolute bottom-10 font-mono text-[10px] text-black/5 tracking-[2.5em] uppercase transition-opacity pointer-events-none ${!isSealed ? 'opacity-0' : 'opacity-100'}`}>
                Archiving_In_Progress
            </div>
        </div>
      )}

      {/* --- 剩余内容保持原逻辑 --- */}
      <nav className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-start items-start pointer-events-none pb-4 pt-0 w-12">
        <div className="flex flex-col gap-1 pointer-events-auto items-start">
            <button onClick={() => handleCategoryChange('全部')} className={`relative h-20 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-all duration-300 bg-white ${activeCategory === '全部' && currentDatabaseId === null ? 'translate-x-0 w-10 shadow-md z-30' : '-translate-x-1 hover:translate-x-0 opacity-90 z-20'}`}>
                 {BRAND_CONFIG.mode === 'image' && !logoError ? (
                     <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.text} className="h-4 w-auto max-w-[64px] object-contain rotate-90" onError={() => setLogoError(true)} />
                 ) : (
                    <span className="block [writing-mode:vertical-rl] font-black text-[10px] tracking-widest text-black py-2 uppercase">{BRAND_CONFIG.text}</span>
                 )}
            </button>
            {categories.filter(c => c !== '全部').map((category, idx) => {
                const isActive = activeCategory === category;
                const originalIndex = categories.indexOf(category);
                const tabColor = PALETTE[originalIndex % PALETTE.length];
                return (
                    <button key={category} onClick={() => handleCategoryChange(category)} className={`relative h-16 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-all duration-300 ${isActive ? 'translate-x-0 w-10 shadow-md z-20' : '-translate-x-1 hover:translate-x-0 opacity-90 hover:opacity-100 z-10'}`} style={{ backgroundColor: tabColor }}>
                        <span className={`block [writing-mode:vertical-rl] font-mono text-[10px] font-bold tracking-widest ${isActive ? 'text-black' : 'text-black/60'}`}>{category}</span>
                    </button>
                );
            })}
            <div className="h-2"></div>
            {RESOURCE_LINKS.map((link) => {
                const isCurrentDB = link.type === 'database' && link.id === currentDatabaseId;
                return (
                <button key={link.label} onClick={() => handleResourceClick(link)} className={`relative h-12 w-7 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-transform duration-200 -translate-x-1 hover:translate-x-0 bg-white ${isCurrentDB ? 'translate-x-0 w-9 font-bold shadow-md' : ''}`} style={{ backgroundColor: link.color }}>
                    <span className={`block [writing-mode:vertical-rl] font-mono text-[9px] font-bold text-black/50 tracking-tight ${isCurrentDB ? 'text-black opacity-100' : ''}`}>{link.label}</span>
                </button>
             )})}
        </div>
      </nav>

      <header className="hidden md:block relative w-full z-40 px-2 md:px-8 pt-4 md:pt-6 pointer-events-auto">
        <div className="max-w-7xl mx-auto relative pointer-events-auto">
            <div className="flex items-end overflow-x-auto w-full no-scrollbar relative" style={{ scrollbarWidth: 'none' }}>
                <button onClick={() => handleCategoryChange('全部')} className="relative group flex-shrink-0 mr-[-6px] z-50 h-14 translate-y-[4px]">
                    <div className="w-full h-full rounded-t-xl bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center px-6 min-w-[200px]">
                        {BRAND_CONFIG.mode === 'image' && !logoError ? (
                            <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.text} className={`${BRAND_CONFIG.heightClass} w-auto object-contain select-none pointer-events-none`} onError={() => setLogoError(true)} />
                        ) : (
                            <span className="font-black text-2xl tracking-tighter text-black uppercase">{BRAND_CONFIG.text}</span>
                        )}
                    </div>
                </button>
                {categories.map((category, idx) => {
                    const isActive = activeCategory === category;
                    const tabColor = PALETTE[idx % PALETTE.length];
                    const heightClass = isActive ? 'h-11 translate-y-[4px] z-40' : 'h-11 translate-y-[8px] hover:translate-y-[4px] z-10 hover:z-20'; 
                    return (
                        <button key={category} onClick={() => handleCategoryChange(category)} className={`relative group flex-shrink-0 mr-[-8px] px-0 transition-all duration-200 ease-out ${heightClass}`}>
                            <div className={`w-full h-full rounded-t-xl border-t border-x border-black/5 shadow-[inset_0_-4px_4px_rgba(0,0,0,0.02)] flex items-center justify-center px-4 md:px-5 min-w-[90px] md:min-w-[100px] pt-1`} style={{ backgroundColor: tabColor }}>
                                <span className={`font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-black/70 group-hover:text-black transition-colors ${isActive ? 'text-black' : ''}`}>{category}</span>
                            </div>
                        </button>
                    );
                })}
                <div className="flex-grow"></div>
                <div className="flex items-end gap-3 pl-4 -translate-x-[5px]">
                    {RESOURCE_LINKS.map((link) => {
                        const isCurrentDB = link.type === 'database' && ((link.id === currentDatabaseId) || (currentDatabaseId === null && link.id === process.env.NOTION_DATABASE_ID));
                        return (
                         <button key={link.label} onClick={() => handleResourceClick(link)} className={`relative group h-8 w-16 md:h-9 md:w-[54px] rounded-t-lg border border-black/10 shadow-sm flex items-center justify-center transition-transform translate-y-[8px] hover:translate-y-[4px] z-0 hover:z-40 pt-1 cursor-pointer ${isCurrentDB ? 'bg-white z-50 translate-y-[4px] border-b-white pb-2 shadow-none' : ''}`} style={{ backgroundColor: isCurrentDB ? '#fff' : link.color }}>
                            <span className={`font-mono text-[8px] font-bold tracking-tight whitespace-nowrap ${isCurrentDB ? 'text-black' : 'text-black/60'}`}>{link.label}</span>
                         </button>
                    )})}
                </div>
            </div>
        </div>
      </header>

      <main className="flex-grow pl-12 md:px-8 md:pb-12 z-20 md:pt-0">
        <div className="max-w-7xl mx-auto min-h-[100dvh] md:min-h-[85vh] bg-white md:bg-[#FDFBF7] md:rounded-b-lg md:rounded-tr-lg rounded-none shadow-none md:shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_0_rgba(0,0,0,0.1)] relative border-t-0 md:border-t border-black/5">
            <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-dashed border-gray-200">
                <div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">// ARCHIVE_DRAWER_{getDrawerNumber()} / {currentDatabaseLabel}</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 mb-2">{activeCategory === '全部' ? `${currentDatabaseLabel} 库` : activeCategory}</h1>
                </div>
            </div>
            <div className="px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {loading && !useMock ? (
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        displayedSchemes.map(scheme => (
                            <ArchiveCard key={scheme.id} scheme={scheme} onClick={() => setSelectedScheme(scheme)} />
                        ))
                    )}
                </div>
            </div>
            <div className="relative h-16 bg-white md:bg-[#FDFBF7] md:rounded-b-lg rounded-none border-t border-black/5 mt-auto flex items-center justify-center">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">ThinkPPT Archive System © 2025</span>
            </div>
        </div>
      </main>

      <Archivist />
      {selectedScheme && <SchemeDetail scheme={selectedScheme} onClose={() => setSelectedScheme(null)} isResourceDb={currentDatabaseId === process.env.NOTION_DB_AI_ID} />}
    </div>
  );
}
