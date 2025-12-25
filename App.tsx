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
    color: '#FFF9E1' 
  },
  { 
    label: '关于', 
    type: 'page', 
    id: process.env.NOTION_PAGE_ABOUT_ID, 
    color: '#F0F0F0' 
  },
  { 
    label: '订阅', 
    type: 'page', 
    id: process.env.NOTION_PAGE_SUBSCRIBE_ID, 
    color: '#E1F0FF' 
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
  <div className="relative w-full aspect-[3/4] lg:aspect-[3/4.2] mx-auto mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
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

  // 初始化时检查本地缓存实现秒开
  useEffect(() => {
    const cachedData = localStorage.getItem('thinkppt_schemes_cache');
    const cachedCats = localStorage.getItem('thinkppt_categories_cache');
    
    if (cachedData && !currentDatabaseId) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSchemes(parsed);
          setLoading(false);
          if (cachedCats) setCategories(JSON.parse(cachedCats));
        }
      } catch (e) {
        console.warn("Failed to load local cache");
      }
    }
  }, []);

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
      
      if (!cursor && schemes.length === 0) setLoading(true);
      if (cursor) setLoadingMore(true);

      const urlParams = new URLSearchParams(window.location.search);
      const isForceRefresh = urlParams.get('refresh') === 'true';

      let url = `/api/schemes`;
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);
      if (currentCategory && currentCategory !== '全部') params.append('category', currentCategory);
      if (targetDbId) params.append('db_id', targetDbId);
      if (isForceRefresh) params.append('refresh', 'true');

      const res = await fetch(`${url}?${params.toString()}`);
      if (!res.ok) {
           if (schemes.length === 0) {
             setSchemes(MOCK_SCHEMES); 
             setCategories(DEFAULT_CATEGORIES); 
             setUseMock(true);
           }
      } else {
           const data = await res.json();
           const mappedData = mapNotionResultToSchemes(data);
           
           if (!cursor && data.categories) {
             setCategories(data.categories);
             if (!targetDbId) localStorage.setItem('thinkppt_categories_cache', JSON.stringify(data.categories));
           }

           if (cursor) {
             setSchemes(prev => [...prev, ...mappedData]);
           } else {
             setSchemes(mappedData);
             setUseMock(false);
             // 仅缓存主页“全部”内容，避免缓存过大
             if (!targetDbId && currentCategory === '全部') {
               localStorage.setItem('thinkppt_schemes_cache', JSON.stringify(mappedData));
             }
           }
           setNextCursor(data.next_cursor);
           setHasMore(data.has_more);
      }
    } catch (error) {
      if (schemes.length === 0) {
        setSchemes(MOCK_SCHEMES); 
        setCategories(DEFAULT_CATEGORIES); 
        setUseMock(true);
      }
    } finally { 
      setLoading(false); 
      setLoadingMore(false); 
    }
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
      setNextCursor(null); setHasMore(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchSchemes(null, category);
  };

  const handleReturnToMainDb = () => {
     setCurrentDatabaseId(null); setCurrentDatabaseLabel('方案');
     setActiveCategory('全部'); setNextCursor(null); setHasMore(false);
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
    <div className="min-h-[100dvh] bg-transparent lg:bg-[#e8e4da] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden flex flex-col">
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .archive-bag-shadow { box-shadow: 0 40px 80px -20px rgba(0,0,0,0.3); }
        .archive-flap-shadow { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15)); }
      `}</style>

      {/* 加载遮罩层 */}
      {showOverlay && (
        <div 
            onClick={() => setIsSealed(false)} 
            className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#f7f7f7] transition-opacity duration-500 cursor-pointer ${!isSealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            {/* Kraft Bag Style Update - Removed archive-bag-shadow */}
            <div className={`relative w-[340px] h-[250px] md:w-[480px] md:h-[350px] bg-[#D8CBB7] rounded-[8px] flex flex-col items-center transition-transform duration-500`}>
                <div className="absolute top-0 left-0 right-0 h-[32%] z-30 archive-flap-shadow pointer-events-none">
                    <svg viewBox="0 0 480 112" preserveAspectRatio="none" className="w-full h-full fill-[#E6DCC9]">
                        <path d="M0,0 L480,0 L480,0 L455,95 Q450,112 430,112 L50,112 Q30,112 25,95 L0,0 Z" />
                    </svg>
                </div>
                <div className="absolute top-8 md:top-12 z-40 pointer-events-none w-full text-center px-4">
                    <span className="text-[10px] md:text-xs text-black/40 font-medium tracking-[0.2em] uppercase">策划人的方案档案库</span>
                </div>
                <div className="absolute top-[22%] md:top-[25%] left-0 right-0 flex flex-col items-center z-40 pointer-events-none">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#f0f0f0] rounded-full border border-black/5 flex items-center justify-center shadow-md">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="w-[1.5px] h-10 md:h-14 bg-black/10"></div>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#f0f0f0] rounded-full border border-black/5 flex items-center justify-center shadow-md -mt-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pt-16 md:pt-24 pointer-events-none px-6">
                    <div className="flex flex-col items-center mb-1">
                        {BRAND_CONFIG.mode === 'image' && !overlayLogoError ? (
                            <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.text} className="h-10 md:h-16 w-auto object-contain brightness-0 opacity-90" onError={() => setOverlayLogoError(true)} />
                        ) : (
                            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-[#2A2A2A]">{BRAND_CONFIG.text}</h1>
                        )}
                    </div>
                    <div className="mt-2">
                        <span className="text-xs md:text-sm font-medium tracking-[0.4em] text-[#2A2A2A]/70">〔 深刻PPT 〕</span>
                    </div>
                </div>
                <div className="absolute inset-0 border border-black/5 rounded-[8px] pointer-events-none"></div>
            </div>
            <div className={`absolute bottom-10 w-full text-center indent-[2.5em] font-mono text-[10px] text-black/10 tracking-[2.5em] uppercase transition-opacity pointer-events-none ${!isSealed ? 'opacity-0' : 'opacity-100'}`}>点击开启</div>
        </div>
      )}

      {/* 侧边导航 (移动端) - 更新背景色为 #FDFBF7 */}
      <nav className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-start items-start pointer-events-auto pb-4 pt-0 w-12 bg-[#FDFBF7] border-r border-black/5">
        <div className="flex flex-col gap-1 pointer-events-auto items-start">
            <button onClick={() => handleCategoryChange('全部')} className={`relative h-20 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-all duration-300 bg-[#FDFBF7] ${activeCategory === '全部' && currentDatabaseId === null ? 'translate-x-0 w-10 shadow-md z-30' : '-translate-x-1 hover:translate-x-0 opacity-90 z-20'}`}>
                 {BRAND_CONFIG.mode === 'image' && !logoError ? (
                     <div className="w-8 h-20 flex items-center justify-center overflow-hidden">
                         <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.text} className="h-4 w-auto max-w-[64px] object-contain rotate-90" onError={() => setLogoError(true)} />
                     </div>
                 ) : (
                    <span className="block [writing-mode:vertical-rl] font-black text-[10px] tracking-widest text-black py-2 uppercase">{BRAND_CONFIG.text}</span>
                 )}
            </button>
            {categories.filter(c => c !== '全部').map((category, idx) => {
                const isActive = activeCategory === category;
                const paletteColors = [PALETTE.KRAFT_INNER, PALETTE.KRAFT_OUTER, '#D4B595', '#CEB28E'];
                const tabColor = paletteColors[categories.indexOf(category) % paletteColors.length];
                return (
                    <button key={category} onClick={() => handleCategoryChange(category)} className={`relative h-16 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-all duration-300 ${isActive ? 'translate-x-0 w-10 shadow-md z-20' : '-translate-x-1 hover:translate-x-0 opacity-90 z-10'}`} style={{ backgroundColor: tabColor }}>
                        <span className={`block [writing-mode:vertical-rl] font-mono text-[10px] font-bold tracking-widest ${isActive ? 'text-black' : 'text-black/80'}`}>{category}</span>
                    </button>
                );
            })}
            <div className="h-2"></div>
            {RESOURCE_LINKS.map((link) => {
                const isCurrentDB = link.type === 'database' && link.id === currentDatabaseId;
                return (
                <button key={link.label} onClick={() => handleResourceClick(link)} className={`relative h-12 w-7 rounded-r-md border-y border-r border-black/10 shadow-sm flex items-center justify-center transition-transform duration-200 -translate-x-1 hover:translate-x-0 bg-[#FDFBF7] ${isCurrentDB ? 'translate-x-0 w-9 font-bold shadow-md' : ''}`} style={{ backgroundColor: link.color }}>
                    <span className={`block [writing-mode:vertical-rl] font-mono text-[9px] font-bold text-black/60 tracking-tight ${isCurrentDB ? 'text-black' : ''}`}>{link.label}</span>
                </button>
             )})}
        </div>
      </nav>

      {/* 顶部导航 (桌面端) */}
      <header className="hidden lg:block relative w-full z-40 px-8 pt-6 pointer-events-auto">
        <div className="max-w-7xl mx-auto relative pointer-events-auto">
            <div className="flex items-end overflow-x-auto w-full no-scrollbar relative" style={{ scrollbarWidth: 'none' }}>
                <button onClick={() => handleCategoryChange('全部')} className="relative group flex-shrink-0 mr-[-6px] z-50 h-14 translate-y-[4px]">
                    <div className="w-full h-full rounded-t-xl bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center px-6 min-w-[200px]">
                        {BRAND_CONFIG.mode === 'image' && !logoError ? (
                            <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.text} className={`${BRAND_CONFIG.heightClass} w-auto object-contain select-none pointer-events-none`} onError={() => setLogoError(true)} />
                        ) : (
                            <span className="font-black text-lg tracking-tighter text-black uppercase">{BRAND_CONFIG.text}</span>
                        )}
                    </div>
                </button>
                {categories.map((category, idx) => {
                    const isActive = activeCategory === category;
                    const paletteColors = [PALETTE.KRAFT_INNER, PALETTE.KRAFT_OUTER, '#D4B595', '#CEB28E'];
                    const tabColor = paletteColors[idx % paletteColors.length];
                    const heightClass = isActive ? 'h-11 translate-y-[4px] z-40' : 'h-11 translate-y-[8px] hover:translate-y-[4px] z-10 hover:z-20'; 
                    return (
                        <button key={category} onClick={() => handleCategoryChange(category)} className={`relative group flex-shrink-0 mr-[-8px] px-0 transition-all duration-200 ease-out ${heightClass}`}>
                            <div className={`w-full h-full rounded-t-xl border-t border-x border-black/5 shadow-[inset_0_-4px_4px_rgba(0,0,0,0.02)] flex items-center justify-center px-5 min-w-[100px] pt-1`} style={{ backgroundColor: tabColor }}>
                                <span className={`font-mono text-xs font-bold uppercase tracking-wider text-black/80 group-hover:text-black transition-colors ${isActive ? 'text-black' : ''}`}>{category}</span>
                            </div>
                        </button>
                    );
                })}
                <div className="flex-grow min-w-[20px]"></div>
                <div className="flex items-end gap-3 pl-4 -translate-x-[5px]">
                    {RESOURCE_LINKS.map((link) => {
                        const isCurrentDB = link.type === 'database' && ((link.id === currentDatabaseId) || (currentDatabaseId === null && link.id === process.env.NOTION_DATABASE_ID));
                        return (
                         <button key={link.label} onClick={() => handleResourceClick(link)} className={`relative group h-9 w-[54px] rounded-t-lg border border-black/10 shadow-sm flex items-center justify-center transition-transform translate-y-[8px] hover:translate-y-[4px] z-0 hover:z-40 pt-1 cursor-pointer ${isCurrentDB ? 'bg-white z-50 translate-y-[4px] border-b-white pb-2 shadow-none' : ''}`} style={{ backgroundColor: isCurrentDB ? '#fff' : link.color }}>
                            <span className={`font-mono text-[8px] font-bold tracking-tight whitespace-nowrap ${isCurrentDB ? 'text-black' : 'text-black/70'}`}>{link.label}</span>
                         </button>
                    )})}
                </div>
            </div>
        </div>
      </header>

      {/* 主内容区 - 移动端背景色改为 #FDFBF7 */}
      <main className="flex-grow pl-12 lg:px-8 lg:pb-12 z-20 pt-0">
        <div className="max-w-7xl mx-auto min-h-[100dvh] lg:min-h-[85vh] bg-[#FDFBF7] lg:bg-[#FDFBF7] lg:rounded-b-lg lg:rounded-tr-lg rounded-none shadow-none lg:shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative border-t-0 lg:border-t border-black/5">
            <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-dashed border-gray-200">
                <div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">// ARCHIVE_DRAWER_{getDrawerNumber()} / {currentDatabaseLabel}</span>
                    <h1 className="text-2xl md:text-4xl font-heading font-black uppercase tracking-tight text-gray-900 mb-2">
                        {activeCategory === '全部' ? (currentDatabaseId === null ? '策划人的方案档案库' : `${currentDatabaseLabel} 库`) : activeCategory}
                    </h1>
                </div>
            </div>

            <div className="px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        displayedSchemes.map(scheme => (
                            <ArchiveCard key={scheme.id} scheme={scheme} onClick={() => setSelectedScheme(scheme)} />
                        ))
                    )}
                </div>
                {loadingMore && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-16">{Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>}
                
                {hasMore && !loading && (
                  <div className="mt-20 flex justify-center">
                    <button onClick={() => fetchSchemes(nextCursor)} disabled={loadingMore} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {loadingMore ? '检索中...' : '加载更多档案'}
                    </button>
                  </div>
                )}
            </div>

            <div className="relative h-16 bg-[#FDFBF7] lg:bg-[#FDFBF7] lg:rounded-b-lg rounded-none border-t border-black/5 mt-auto flex items-center justify-center">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">ThinkPPT Archive System © 2025</span>
            </div>
        </div>
      </main>

      <Archivist />
      {selectedScheme && <SchemeDetail scheme={selectedScheme} onClose={() => setSelectedScheme(null)} isResourceDb={currentDatabaseId === process.env.NOTION_DB_AI_ID} />}
    </div>
  );
}