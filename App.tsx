import React, { useState, useEffect } from 'react';
import { ArchiveCard } from './components/ArchiveCard';
import { Archivist } from './components/Archivist';
import { SchemeDetail } from './components/SchemeDetail';
import { CATEGORIES, MOCK_SCHEMES } from './constants';
import { Scheme } from './types';
import { mapNotionResultToSchemes } from './utils/notionMapper';

// --- CONFIGURATION START ---
// 您可以在这里修改顶部导航条的链接和文字
const NAV_LINKS = [
  { label: '首页', href: '#' },
  { label: 'ThinkPPT官网', href: 'https://www.thinkppt.com' }, // 示例：链接到您的主站
  { label: '关于', href: '#' }
];
// --- CONFIGURATION END ---

export default function App() {
  const [isSealed, setIsSealed] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [scrolled, setScrolled] = useState(false);
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

      // Append cursor query param if it exists
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
           console.error("API Error:", err);
           
           // Extract friendly error message
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
               // Only show debug msg on initial load error
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
               // Update State
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

  // Initial Load
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden">
      
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
            onClick={() => !loading && setIsSealed(false)}
            className={`
                relative w-[340px] h-[480px] bg-[#FFDAC1] border-[3px] border-black rounded-xl shadow-[12px_12px_0px_0px_#d1d5db] 
                flex flex-col items-center select-none overflow-hidden transition-transform duration-300
                ${loading ? 'cursor-wait opacity-80' : 'cursor-pointer group hover:-translate-y-2'}
            `}
        >
            {/* Top Flap */}
            <div className="absolute top-0 w-full h-32 bg-[#FFC8DD] border-b-[3px] border-black z-20 rounded-t-lg flex justify-center pt-4 shadow-sm">
                 {/* Visual Crease */}
                 <div className="w-full h-px bg-black/5 absolute bottom-1"></div>
                 
                 {/* Top Button (Grommet) - Z-Index 50 to sit ON TOP of the string start */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8D6E63] border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black/30"></div>
                 </div>
            </div>

            {/* String Mechanism */}
            {/* Located precisely to bridge Top Button Center (y=~96px) and Bottom Button Center (y=~176px) */}
            <svg className="absolute top-[96px] left-1/2 -translate-x-1/2 w-24 h-[200px] z-40 pointer-events-none overflow-visible">
                 <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                 </defs>
                 
                 {/* 
                    Path Logic:
                    1. Start at (48, 0) - Behind Top Button
                    2. Drop down to (48, 80) - Center of Bottom Button (Diff is 80px)
                    3. Wind around (48, 80)
                 */}
                 <path 
                    d="
                      M 48,0 
                      L 48,78
                      C 68,78 72,105 48,105 
                      C 24,105 28,78 48,78 
                      C 60,78 62,95 50,110
                      Q 40,125 52,160
                    "
                    fill="none" 
                    stroke="#FDFBF7" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadow)"
                 />
            </svg>

            {/* Bottom Button (Grommet) - Z-Index 30 to sit UNDER the string winding */}
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#8D6E63] border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] z-30 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-black/30"></div>
            </div>

            {/* Stamp */}
            <div className="absolute top-24 right-8 z-30 w-20 h-20 bg-[#A2D2FF] border-2 border-black rounded-full flex flex-col items-center justify-center transform rotate-12 shadow-sm mix-blend-hard-light opacity-90">
                <span className="font-black text-lg leading-none">NEW</span>
                <span className="text-[10px] font-mono">2025</span>
            </div>

            {/* Label Area */}
            <div className="mt-60 w-3/4 bg-white border-2 border-black p-4 rotate-[-2deg] shadow-[4px_4px_0px_#e5e7eb] relative z-10">
                <div className="border-b-2 border-dotted border-black mb-2 pb-1">
                    <span className="font-mono text-[10px] text-gray-400">PROJECT NAME</span>
                    <h1 className="font-black text-3xl uppercase tracking-tight">ThinkPPT</h1>
                </div>
                <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] text-gray-400">
                        {loading ? 'SYNCING...' : (useMock ? 'DEMO MODE' : 'LIVE DATA')}
                    </span>
                    <span className="font-bold text-xs bg-black text-white px-2 py-0.5 rounded-full">
                        {loading ? 'WAIT' : 'OPEN'}
                    </span>
                </div>
            </div>

            <p className="absolute bottom-6 font-mono text-[10px] opacity-40 tracking-widest text-center px-4 max-w-full truncate text-red-500 font-bold">
                {debugMsg ? debugMsg : (loading ? 'CONNECTING TO ARCHIVE...' : 'TOUCH TO UNSEAL')}
            </p>
        </div>
      </div>


      {/* =========================================================================
          2. Folder Tab Navbar
         ========================================================================= */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out border-b-2 border-transparent ${scrolled ? 'bg-[#FDFBF7]/95 backdrop-blur-sm pt-0 shadow-sm' : 'bg-transparent pt-3'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
            <div 
                className={`flex items-end gap-1 relative z-10 top-[3px] overflow-x-auto w-full`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div 
                    className={`
                        bg-black text-white 
                        px-3 md:px-6 
                        rounded-t-xl border-2 border-black border-b-0 flex items-center gap-2 transition-all duration-300 origin-bottom flex-shrink-0 
                        ${scrolled ? 'h-10 md:h-12 py-1 md:py-2' : 'h-12 md:h-16 py-2 md:py-3'}
                    `}
                >
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FFC8DD]"></div>
                    <span className="font-bold font-mono tracking-tighter text-xs md:text-base">THINK_PPT</span>
                </div>

                {NAV_LINKS.map((link, idx) => {
                    const colors = ['bg-[#CDEAC0]', 'bg-[#A2D2FF]', 'bg-[#FFF6BD]'];
                    const color = colors[idx % colors.length];
                    
                    return (
                        <a 
                          href={link.href}
                          key={link.label}
                          // Add target="_blank" if it's an external link
                          target={link.href.startsWith('http') ? "_blank" : "_self"}
                          rel={link.href.startsWith('http') ? "noopener noreferrer" : ""}
                          className={`
                            ${color} 
                            px-5 md:px-8 
                            rounded-t-xl border-2 border-black border-b-0 
                            font-bold font-mono text-xs md:text-sm 
                            flex items-center justify-center flex-shrink-0
                            transition-all duration-200 ease-out origin-bottom
                            relative
                            group
                            ${scrolled ? 'h-9 md:h-10' : 'h-11 md:h-14'}
                            hover:h-12 md:hover:h-16 hover:-translate-y-0.5
                          `}
                        >
                            <span className="group-hover:-translate-y-1 transition-transform duration-200">{link.label}</span>
                        </a>
                    )
                })}
                {/* Spacer to allow scrolling past the last item slightly */}
                <div className="w-4 flex-shrink-0"></div>
            </div>
            
            <div className="w-full h-3 bg-black border-2 border-black relative z-20 shadow-sm rounded-sm"></div>
        </div>
      </nav>


      {/* =========================================================================
          3. Main Content
         ========================================================================= */}
      <main className="pt-36 px-4 md:px-8 max-w-7xl mx-auto min-h-screen pb-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
                <span className="font-mono text-xs font-bold text-gray-400 mb-2 block">// EXPLORE COLLECTIONS</span>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900">
                    Scheme<br/>Archive.
                </h1>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end max-w-md">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            px-4 py-2 font-mono text-xs font-bold border-2 border-black rounded-full transition-all shadow-[2px_2px_0px_#e5e7eb]
                            ${activeCategory === category 
                                ? 'bg-black text-white transform -translate-y-0.5 shadow-none' 
                                : 'bg-white text-black hover:bg-gray-50'
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* Debug Banner if using Mock Data */}
        {useMock && (
             <div className="mb-8 p-4 bg-yellow-100 border-2 border-black border-dashed rounded-lg font-mono text-xs flex justify-between items-center text-wrap break-all">
                 <span className="text-yellow-800 font-bold">⚠️ 模式: {debugMsg || '未连接到 Notion 数据库'}</span>
                 <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="underline ml-4 whitespace-nowrap">检查配置</a>
             </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
            {filteredSchemes.map(scheme => (
                <ArchiveCard 
                  key={scheme.id} 
                  scheme={scheme} 
                  onClick={() => setSelectedScheme(scheme)}
                />
            ))}
        </div>
        
        {filteredSchemes.length === 0 && !loading && (
             <div className="h-64 flex flex-col items-center justify-center font-mono text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center p-8">
                 <p className="mb-2">[ NO FOLDERS FOUND ]</p>
             </div>
        )}

        {/* Load More Button */}
        {!useMock && hasMore && (
            <div className="mt-20 flex justify-center">
                <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="
                        group relative overflow-hidden bg-white text-black font-mono font-bold text-sm 
                        px-12 py-4 border-2 border-black rounded-full 
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                        hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                        active:translate-y-1 active:shadow-none
                        disabled:opacity-50 disabled:cursor-wait
                        transition-all duration-150
                    "
                >
                    {loadingMore ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                            LOADING ARCHIVE...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 uppercase">
                            Load More Schemes
                            <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    )}
                </button>
            </div>
        )}

      </main>

      <Archivist />
      
      {/* Detail Modal Overlay */}
      {selectedScheme && (
        <SchemeDetail 
          scheme={selectedScheme} 
          onClose={() => setSelectedScheme(null)} 
        />
      )}

      {/* Footer Decoration */}
      <footer className="border-t-2 border-black bg-white py-12 text-center font-mono text-xs text-gray-400">
        THINKPPT ARCHIVE © 2025 // DESIGNED WITH MACARON_OS
      </footer>
    </div>
  );
}