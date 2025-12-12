import React, { useState, useEffect } from 'react';
import { ArchiveCard } from './components/ArchiveCard';
import { Archivist } from './components/Archivist';
import { SchemeDetail } from './components/SchemeDetail';
import { CATEGORIES, MOCK_SCHEMES, PALETTE } from './constants';
import { Scheme } from './types';
import { mapNotionResultToSchemes } from './utils/notionMapper';

// --- CONFIGURATION START ---
const NAV_LINKS = [
  { label: 'ThinkPPT官网', href: 'https://www.thinkppt.com', color: '#FFC8DD' },
  { label: '关于本站', href: '#', color: '#A2D2FF' }
];
// --- CONFIGURATION END ---

// Skeleton Card Component for loading state
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
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  
  // Data State
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');

  // Pagination State
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch Data Function
  const fetchSchemes = async (cursor: string | null = null) => {
    try {
      if (cursor) {
          setLoadingMore(true);
      } else {
          setLoading(true);
      }

      const url = cursor ? `/api/schemes?cursor=${cursor}` : '/api/schemes';
      const res = await fetch(url);
      
      if (res.status === 401) {
           console.warn("Notion API Key missing.");
           setDebugMsg("请在 Vercel 环境变量中配置 NOTION_API_KEY");
           setSchemes(MOCK_SCHEMES);
           setUseMock(true);
           setHasMore(false);
      } else if (!res.ok) {
           const err = await res.json();
           let friendlyMsg = res.statusText;
           if (err.details) {
             if (typeof err.details === 'string') {
                try {
                  const parsed = JSON.parse(err.details);
                  friendlyMsg = parsed.message || err.details;
                } catch {
                  friendlyMsg = err.details;
                }
             } else if (err.details.message) {
                friendlyMsg = err.details.message;
             }
           }
           if (!cursor) {
               setDebugMsg(`API Error: ${friendlyMsg}`);
               setSchemes(MOCK_SCHEMES);
               setUseMock(true);
               setHasMore(false);
           }
      } else {
           const data = await res.json();
           const mappedData = mapNotionResultToSchemes(data);

           if (!cursor && mappedData.length === 0) {
               setDebugMsg("连接成功，但数据库为空");
               setSchemes(MOCK_SCHEMES);
               setUseMock(true);
               setHasMore(false);
           } else {
               if (cursor) {
                   setSchemes(prev => [...prev, ...mappedData]);
               } else {
                   setSchemes(mappedData);
                   setDebugMsg("");
                   setUseMock(false);
               }
               setNextCursor(data.next_cursor);
               setHasMore(data.has_more);
           }
      }
    } catch (error) {
      console.error("Failed to load archive:", error);
      if (!cursor) {
        setDebugMsg("网络请求失败");
        setSchemes(MOCK_SCHEMES); 
        setUseMock(true);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleLoadMore = () => {
    if (nextCursor && !loadingMore) {
        fetchSchemes(nextCursor);
    }
  };

  const filteredSchemes = activeCategory === '全部' 
    ? schemes 
    : schemes.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#e8e4da] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden flex flex-col">
      
      {/* Background Texture (The Desk) */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0" 
           style={{ backgroundImage: 'radial-gradient(#a39f94 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* =========================================================================
          1. Macaron Archive Bag Overlay (Loading / Sealed State)
         ========================================================================= */}
      <div 
        className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#F0EBE0] transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${!isSealed ? '-translate-y-full pointer-events-none' : ''}`}
        style={{
            backgroundImage: 'radial-gradient(#d1ccc0 1px, transparent 1px)', 
            backgroundSize: '24px 24px'
        }}
      >
        <div 
            // PERF OPTIMIZATION: Removed "!loading" check so user can enter immediately
            onClick={() => setIsSealed(false)}
            className={`
                relative w-[340px] h-[480px] bg-[#FFDAC1] border-[3px] border-black rounded-xl shadow-[12px_12px_0px_0px_#d1d5db] 
                flex flex-col items-center select-none overflow-hidden transition-transform duration-300
                cursor-pointer group hover:-translate-y-2
            `}
        >
            {/* Top Flap */}
            <div className="absolute top-0 w-full h-32 bg-[#FFC8DD] border-b-[3px] border-black z-20 rounded-t-lg flex justify-center pt-4 shadow-sm">
                 <div className="w-full h-px bg-black/5 absolute bottom-1"></div>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8D6E63] border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black/30"></div>
                 </div>
            </div>

            {/* String Mechanism */}
            <svg className="absolute top-[96px] left-1/2 -translate-x-1/2 w-24 h-[200px] z-40 pointer-events-none overflow-visible">
                 <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                 </defs>
                 <path 
                    d="M 48,0 L 48,78 C 68,78 72,105 48,105 C 24,105 28,78 48,78 C 60,78 62,95 50,110 Q 40,125 52,160"
                    fill="none" 
                    stroke="#FDFBF7" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                 />
            </svg>

            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8D6E63] border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-30 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-black/30"></div>
            </div>

            <div className="absolute top-24 right-8 z-30 w-20 h-20 bg-[#A2D2FF] border-2 border-black rounded-full flex flex-col items-center justify-center transform rotate-12 shadow-sm mix-blend-hard-light opacity-90">
                <span className="font-black text-lg leading-none">NEW</span>
                <span className="text-[10px] font-mono">2025</span>
            </div>

            <div className="mt-60 w-3/4 bg-white border-2 border-black p-4 rotate-[-2deg] shadow-[4px_4px_0px_#e5e7eb] relative z-10">
                <div className="border-b-2 border-dotted border-black mb-2 pb-1">
                    <span className="font-mono text-[10px] text-gray-400">PROJECT NAME</span>
                    <h1 className="font-black text-2xl uppercase tracking-tighter">ThinkPPT.COM</h1>
                </div>
                <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] text-gray-400 font-bold">
                         {useMock ? '演示模式' : '深刻PPT'}
                    </span>
                    <span className="font-bold text-xs bg-black text-white px-2 py-0.5 rounded-full">
                         {loading ? '加载中' : '开启'}
                    </span>
                </div>
            </div>

            <p className="absolute bottom-6 font-mono text-[10px] opacity-40 tracking-widest text-center px-4 max-w-full truncate text-red-500 font-bold">
                {debugMsg ? debugMsg : (loading ? '正在同步档案...' : '点击启封')}
            </p>
        </div>
      </div>


      {/* =========================================================================
          2. THE FOLDER TAB NAVIGATION (Fixed Header)
         ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 px-2 md:px-8 pt-4 md:pt-6 bg-gradient-to-b from-[#e8e4da] via-[#e8e4da] to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto relative pointer-events-auto">
            
            {/* ALIGNMENT FIX: Removed `pl-1` to align perfectly with content below which uses `max-w-7xl mx-auto px-2 md:px-8` */}
            <div className="flex items-end overflow-x-auto w-full no-scrollbar relative" style={{ scrollbarWidth: 'none' }}>
                
                {/* 2.0 LOGO TAB (Wider, distinctive) */}
                <button
                    onClick={() => {
                        setActiveCategory('全部');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    // GAP FIX: increased translate-y to 3px to push it down onto the border
                    className="relative group flex-shrink-0 mr-[-6px] z-50 h-14 translate-y-[3px]"
                >
                    <div className="w-full h-full rounded-t-xl border-t border-x border-black/10 bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center px-6 min-w-[200px]">
                        <span className="font-black text-2xl uppercase tracking-tighter text-black">ThinkPPT</span>
                    </div>
                </button>

                {/* 2.1 CATEGORY TABS (Macaron colored) */}
                {CATEGORIES.map((category, idx) => {
                    const isActive = activeCategory === category;
                    const tabColor = PALETTE[idx % PALETTE.length];
                    
                    // GAP FIX: 
                    // 1. Active tab: translate-y-[3px] ensures it sits ON the border.
                    // 2. Inactive tab: translate-y-[6px] pushes it deeper behind. 
                    // 3. Hover: hover:-translate-y-0.5 lifts it but NOT enough to create a gap (starts from 6px down, moves up to ~3px down).
                    
                    const heightClass = isActive 
                        ? 'h-14 translate-y-[3px] z-40' 
                        : 'h-14 translate-y-[6px] hover:translate-y-[2px] z-10 hover:z-20'; // Adjusted hover math
                    
                    const opacityClass = isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100';
                    
                    return (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`
                                relative group flex-shrink-0 mr-[-8px] 
                                px-0 transition-all duration-200 ease-out
                                ${heightClass} ${opacityClass}
                            `}
                        >
                            {/* The Tab Shape */}
                            <div 
                                className={`w-full h-full rounded-t-xl border-t border-x border-black/5 shadow-[inset_0_-4px_4px_rgba(0,0,0,0.02)] flex items-center justify-center px-5 md:px-6 min-w-[100px] md:min-w-[130px] pt-1`}
                                style={{ backgroundColor: tabColor }}
                            >
                                {/* The "Label" inside the tab */}
                                <span className={`font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-black/70 group-hover:text-black transition-colors ${isActive ? 'text-black' : ''}`}>
                                    {category}
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Spacer */}
                <div className="flex-grow min-w-[20px]"></div>

                {/* 2.2 UTILITY TABS (Fixed vertical text orientation) */}
                <div className="flex items-end gap-3 pl-4">
                    {NAV_LINKS.map((link) => (
                         <a 
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith('http') ? "_blank" : "_self"}
                            rel="noreferrer"
                            className="relative group h-12 w-10 md:h-14 md:w-12 rounded-t-lg border border-black/10 shadow-sm flex items-center justify-center transition-transform hover:-translate-y-2 z-0 hover:z-40 pb-2"
                            style={{ backgroundColor: link.color }}
                         >
                            {/* writing-mode-vertical-rl makes text flow top-to-bottom naturally */}
                            <span className="font-mono text-[9px] font-bold writing-mode-vertical text-black/60 group-hover:text-black tracking-widest">
                                {link.label.slice(0, 4)}
                            </span>
                         </a>
                    ))}
                </div>
            </div>
        </div>
      </header>


      {/* =========================================================================
          3. MAIN CONTENT (The Folder Body)
         ========================================================================= */}
      <main className="flex-grow pt-[calc(3.5rem+12px)] md:pt-[calc(3.5rem+24px)] px-2 md:px-8 pb-12 z-20">
        
        {/* The "Paper" Container connected to tabs */}
        <div className="max-w-7xl mx-auto min-h-[85vh] bg-[#FDFBF7] rounded-b-lg rounded-tr-lg shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_0_rgba(0,0,0,0.1)] relative border-t border-black/5">
            
            {/* Visual Header Inside Folder */}
            <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-dashed border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
                            // ARCHIVE_DRAWER_01 / {activeCategory}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 mb-2">
                            {activeCategory === '全部' ? 'Master Archive' : activeCategory}
                        </h1>
                        <p className="font-mono text-xs text-gray-500 max-w-lg">
                            {loading ? '正在检索文件...' : `已检索到 ${filteredSchemes.length} 个档案.`}
                        </p>
                    </div>
                    {/* Decorative Stamp */}
                    <div className="hidden md:flex w-24 h-24 border-4 border-red-500/20 rounded-full items-center justify-center -rotate-12">
                        <span className="text-red-500/30 font-black text-xl uppercase">绝密</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="px-6 md:px-12 py-12">
                {/* Debug Banner */}
                {useMock && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 border-dashed rounded-lg font-mono text-xs flex justify-between items-center text-wrap break-all">
                        <span className="text-yellow-800">⚠️ 演示模式: {debugMsg}</span>
                        <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="underline ml-4 whitespace-nowrap">检查配置</a>
                    </div>
                )}

                {/* Loading Skeletons OR Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {loading && !useMock ? (
                        // Show Skeletons when loading
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        filteredSchemes.map(scheme => (
                            <ArchiveCard 
                            key={scheme.id} 
                            scheme={scheme} 
                            onClick={() => setSelectedScheme(scheme)}
                            />
                        ))
                    )}
                </div>
                
                {!loading && filteredSchemes.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center font-mono text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 text-center p-8">
                        <p className="mb-2 uppercase tracking-widest">[ 空文件夹 ]</p>
                    </div>
                )}

                {/* Load More Button - Integrated Style */}
                {!useMock && hasMore && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="
                                group relative overflow-hidden bg-[#e8e4da] text-black font-mono font-bold text-xs 
                                px-8 py-3 rounded border border-black/10
                                shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                                hover:translate-y-0.5 hover:shadow-none
                                disabled:opacity-50 transition-all
                            "
                        >
                            {loadingMore ? '正在调取...' : '加载更多档案 +'}
                        </button>
                    </div>
                )}
            </div>

            {/* Folder Footer Flap (Visual End of Folder) */}
            <div className="relative h-16 bg-[#FDFBF7] rounded-b-lg border-t border-black/5 mt-auto flex items-center justify-center overflow-hidden">
                {/* Texture */}
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}></div>
                
                {/* Embossed Lines */}
                <div className="absolute inset-x-0 bottom-3 h-[2px] bg-black/5 border-b border-white"></div>
                <div className="absolute inset-x-0 bottom-6 h-[2px] bg-black/5 border-b border-white"></div>
                
                <span className="relative z-10 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                    ThinkPPT Archive System © 2025
                </span>
            </div>
            
        </div>
      </main>

      <Archivist />
      
      {/* Detail Modal */}
      {selectedScheme && (
        <SchemeDetail 
          scheme={selectedScheme} 
          onClose={() => setSelectedScheme(null)} 
        />
      )}

    </div>
  );
}