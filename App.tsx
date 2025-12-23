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

/**
 * 资源链接/多数据库导航配置:
 * 右上角展示标签：AI (数据库), 订阅 (页面), 官网 (外部链接)
 */
const RESOURCE_LINKS: ResourceLink[] = [
  { 
    label: 'AI', 
    type: 'database', 
    id: process.env.NOTION_DB_AI_ID, 
    color: '#FFF6BD' 
  },
  { 
    label: '订阅', 
    type: 'page', 
    id: process.env.NOTION_PAGE_SUBSCRIBE_ID, 
    color: '#A2D2FF' 
  },
  { 
    label: '官网', 
    type: 'link', 
    href: 'https://www.thinkppt.com', 
    color: '#e5e7eb' 
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

interface FloatingFolderProps {
  color: string;
  style: React.CSSProperties;
  delay: string;
}

const FloatingFolder: React.FC<FloatingFolderProps> = ({ color, style, delay }) => (
    <div 
        className="absolute w-28 h-20 md:w-40 md:h-28 rounded-lg flex items-center justify-center transform transition-transform"
        style={{ 
            backgroundColor: color, 
            boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            ...style,
            animation: `float 6s ease-in-out infinite ${delay}`
        }}
    >
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 rounded-t-lg border-b border-black/5"></div>
        <div className="absolute top-[40%] -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm z-10 border border-black/5 flex items-center justify-center">
             <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[1px] h-4 bg-white/60"></div>
    </div>
);

export default function App() {
  const [isSealed, setIsSealed] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [logoError, setLogoError] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('全部');
  const [categories, setCategories] = useState<string[]>(['全部']); 
  const [currentDatabaseId, setCurrentDatabaseId] = useState<string | null>(null); 
  const [currentDatabaseLabel, setCurrentDatabaseLabel] = useState('方案'); 
  
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const bgFolders = [
    { color: PALETTE[0], top: '10%', left: '15%', rotate: '-15deg', scale: 0.8, delay: '0s' },  
    { color: PALETTE[1], top: '20%', left: '85%', rotate: '12deg', scale: 0.75, delay: '1s' }, 
    { color: PALETTE[2], top: '65%', left: '8%', rotate: '8deg', scale: 0.85, delay: '0.5s' }, 
    { color: PALETTE[3], top: '75%', left: '80%', rotate: '-10deg', scale: 0.9, delay: '1.5s' }, 
    { color: PALETTE[4], top: '40%', left: '-5%', rotate: '35deg', scale: 0.6, delay: '2s' },  
    { color: PALETTE[5], top: '35%', left: '95%', rotate: '-25deg', scale: 0.65, delay: '0.2s' }, 
    { color: PALETTE[6], top: '5%', left: '55%', rotate: '5deg', scale: 0.5, delay: '3s' },    
    { color: PALETTE[7], top: '90%', left: '40%', rotate: '-5deg', scale: 0.6, delay: '2.5s' }, 
    { color: PALETTE[8], top: '15%', left: '5%', rotate: '20deg', scale: 0.55, delay: '1.8s' }, 
    { color: PALETTE[9], top: '85%', left: '92%', rotate: '-15deg', scale: 0.5, delay: '3.5s' }, 
  ];

  useEffect(() => {
    if (!isSealed) {
        const timer = setTimeout(() => {
            setShowOverlay(false);
        }, 1200);
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

      if (cursor) {
          setLoadingMore(true);
      } else {
          setLoading(true);
      }

      let url = `/api/schemes`;
      const params = new URLSearchParams();
      
      if (cursor) params.append('cursor', cursor);
      if (currentCategory && currentCategory !== '全部') params.append('category', currentCategory);
      if (targetDbId) params.append('db_id', targetDbId);

      const res = await fetch(`${url}?${params.toString()}`);
      
      if (res.status === 401) {
           setDebugMsg("未检测到 Notion 配置");
           setSchemes(MOCK_SCHEMES);
           setCategories(DEFAULT_CATEGORIES);
           setUseMock(true);
           setHasMore(false);
      } else if (!res.ok) {
           if (!cursor) {
               setDebugMsg(`请求异常: ${res.statusText}`);
               setSchemes(MOCK_SCHEMES);
               setCategories(DEFAULT_CATEGORIES);
               setUseMock(true);
               setHasMore(false);
           }
      } else {
           const data = await res.json();
           const mappedData = mapNotionResultToSchemes(data);
            
           if (!cursor && data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories(data.categories);
              if (activeCategory !== '全部' && !data.categories.includes(activeCategory)) {
                  setActiveCategory('全部');
              }
           }

           if (!cursor && mappedData.length === 0 && !useMock) {
               setSchemes([]); 
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
      if (!cursor) {
        setDebugMsg("无法连接到档案服务器");
        setSchemes(MOCK_SCHEMES); 
        setCategories(DEFAULT_CATEGORIES);
        setUseMock(true);
        setHasMore(false);
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
              if (mapped.length > 0) {
                  setSelectedScheme(mapped[0]);
              }
          }
      } catch (e) {
          console.error(e);
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

  const handleCategoryChange = (category: string) => {
      if (category === '全部' && currentDatabaseId !== null) {
          handleReturnToMainDb();
          return;
      }
      if (activeCategory === category) return;
      
      setActiveCategory(category);
      setSchemes([]); 
      setNextCursor(null);
      setHasMore(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchSchemes(null, category);
  };

  const handleReturnToMainDb = () => {
     if (currentDatabaseId === null) {
         if (activeCategory !== '全部') {
             setActiveCategory('全部');
             setSchemes([]);
             setNextCursor(null);
             fetchSchemes(null, '全部');
         }
         return;
     }
     setCurrentDatabaseId(null); 
     setCurrentDatabaseLabel('方案');
     setActiveCategory('全部');
     setSchemes([]);
     setNextCursor(null);
     setHasMore(false);
     window.scrollTo({ top: 0, behavior: 'smooth' });
     fetchSchemes(null, '全部', null);
  }
  
  const handleResourceClick = (resource: ResourceLink) => {
      if (resource.type === 'database' && resource.id) {
          if (resource.id === currentDatabaseId) return; 
          
          setCurrentDatabaseId(resource.id);
          setCurrentDatabaseLabel(resource.label); 
          setActiveCategory('全部');
          setSchemes([]);
          setNextCursor(null);
          setHasMore(false);
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-15px) rotate(calc(var(--tw-rotate, 0deg) + 2deg)); }
        }
        @keyframes float-central {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
      `}</style>

      <div className="hidden md:block fixed inset-0 pointer-events-none opacity-40 z-0" 
           style={{ backgroundImage: 'radial-gradient(#a39f94 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {showOverlay && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#ffffff] transition-all duration-700 ease-in-out ${!isSealed ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
            <div className="absolute inset-0 overflow-hidden perspective-1000">
                {bgFolders.map((item, i) => (
                    <FloatingFolder 
                        key={i}
                        color={item.color}
                        delay={item.delay}
                        style={{
                            top: item.top,
                            left: item.left,
                            transform: `rotate(${item.rotate}) scale(${item.scale})`
                        }}
                    />
                ))}
            </div>

            <div 
                onClick={() => setIsSealed(false)}
                className="relative z-50 cursor-pointer group"
                style={{ animation: 'float-central 5s ease-in-out infinite' }}
            >
                <div 
                    className="w-[320px] h-[240px] md:w-[480px] md:h-[340px] rounded-lg flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105 relative"
                    style={{ 
                        backgroundColor: '#01847E',
                        boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(1, 132, 126, 0.4)'
                    }}
                >
                    <div className="absolute top-0 left-0 right-0 h-[35%] bg-white/10 rounded-t-lg border-b border-black/5"></div>

                    <div className="relative z-20 flex flex-col items-center justify-center mt-14 text-center">
                         <h1 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter drop-shadow-sm select-none">
                             ThinkPPT
                         </h1>
                         <span className="text-white/80 text-xs md:text-sm font-bold tracking-widest mt-2">
                            ﹝深刻PPT﹞
                         </span>
                    </div>

                    <div className="absolute top-[35%] -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30">
                        <span className="absolute -top-7 whitespace-nowrap text-[10px] text-white/80 font-mono tracking-widest font-bold">
                            策划人的方案档案库
                        </span>
                        <div className="w-5 h-5 md:w-7 md:h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="w-0.5 h-6 md:h-10 bg-white/80"></div>
                        <div className="w-5 h-5 md:w-7 md:h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 text-white/90 font-mono text-xs uppercase tracking-widest animate-pulse font-bold">
                        {loading ? '档案调取中...' : '点击开启档案库'}
                    </div>
                </div>
            </div>
        </div>
      )}

      <nav className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-start items-start pointer-events-none pb-4 pt-0 w-12">
        <div className="flex flex-col gap-1 pointer-events-auto items-start">
            <button
                onClick={() => handleCategoryChange('全部')}
                className={`
                    relative h-20 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm
                    flex items-center justify-center transition-all duration-300 bg-white
                    ${activeCategory === '全部' && currentDatabaseId === null ? 'translate-x-0 w-10 shadow-md z-30' : '-translate-x-1 hover:translate-x-0 opacity-90 z-20'}
                `}
            >
                 {BRAND_CONFIG.mode === 'image' && !logoError ? (
                     <div className="w-8 h-20 flex items-center justify-center overflow-hidden">
                         <img 
                            src={BRAND_CONFIG.logoUrl} 
                            alt={BRAND_CONFIG.text} 
                            className="h-4 w-auto max-w-[64px] object-contain rotate-90"
                            onError={() => setLogoError(true)}
                         />
                     </div>
                 ) : (
                    <span className="block [writing-mode:vertical-rl] font-black text-[10px] tracking-widest text-black py-2">
                        {BRAND_CONFIG.text}
                    </span>
                 )}
            </button>

            {categories.filter(c => c !== '全部').map((category, idx) => {
                const isActive = activeCategory === category;
                const originalIndex = categories.indexOf(category);
                const tabColor = PALETTE[originalIndex % PALETTE.length];
                return (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`
                            relative h-16 w-8 rounded-r-md border-y border-r border-black/10 shadow-sm
                            flex items-center justify-center transition-all duration-300
                            ${isActive ? 'translate-x-0 w-10 shadow-md z-20' : '-translate-x-1 hover:translate-x-0 opacity-90 hover:opacity-100 z-10'}
                        `}
                        style={{ backgroundColor: tabColor }}
                    >
                        <span className={`block [writing-mode:vertical-rl] font-mono text-[10px] font-bold tracking-widest ${isActive ? 'text-black' : 'text-black/60'}`}>
                            {category}
                        </span>
                    </button>
                );
            })}
            
            <div className="h-2"></div>

            {RESOURCE_LINKS.map((link) => {
                const isCurrentDB = link.type === 'database' && link.id === currentDatabaseId;
                return (
                <button 
                    key={link.label}
                    onClick={() => {
                        if (link.type === 'link') {
                            window.open(link.href, '_blank');
                        } else {
                            handleResourceClick(link);
                        }
                    }}
                    className={`
                        relative h-12 w-7 rounded-r-md border-y border-r border-black/10 shadow-sm
                        flex items-center justify-center transition-transform duration-200
                        -translate-x-1 hover:translate-x-0 bg-white
                        ${isCurrentDB ? 'translate-x-0 w-9 font-bold shadow-md' : ''}
                    `}
                    style={{ backgroundColor: isCurrentDB ? link.color : link.color }}
                >
                    <span className={`block [writing-mode:vertical-rl] font-mono text-[9px] font-bold text-black/50 tracking-tight ${isCurrentDB ? 'text-black opacity-100' : ''}`}>
                        {link.label}
                    </span>
                </button>
             )})}
        </div>
      </nav>

      <header className="hidden md:block relative w-full z-40 px-2 md:px-8 pt-4 md:pt-6 pointer-events-auto">
        <div className="max-w-7xl mx-auto relative pointer-events-auto">
            <div className="flex items-end overflow-x-auto w-full no-scrollbar relative" style={{ scrollbarWidth: 'none' }}>
                <button
                    onClick={() => handleCategoryChange('全部')}
                    className="relative group flex-shrink-0 mr-[-6px] z-50 h-14 translate-y-[4px]"
                >
                    <div className="w-full h-full rounded-t-xl bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center px-6 min-w-[200px]">
                        {BRAND_CONFIG.mode === 'image' && !logoError ? (
                            <img 
                                src={BRAND_CONFIG.logoUrl}
                                alt={BRAND_CONFIG.text}
                                className={`${BRAND_CONFIG.heightClass} w-auto object-contain select-none pointer-events-none`}
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <span className="font-black text-2xl tracking-tighter text-black">
                                {BRAND_CONFIG.text}
                            </span>
                        )}
                    </div>
                </button>

                {categories.map((category, idx) => {
                    const isActive = activeCategory === category;
                    const tabColor = PALETTE[idx % PALETTE.length];
                    const heightClass = isActive ? 'h-11 translate-y-[4px] z-40' : 'h-11 translate-y-[8px] hover:translate-y-[4px] z-10 hover:z-20'; 
                    return (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`relative group flex-shrink-0 mr-[-8px] px-0 transition-all duration-200 ease-out ${heightClass} ${isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                        >
                            <div 
                                className={`w-full h-full rounded-t-xl border-t border-x border-black/5 shadow-[inset_0_-4px_4px_rgba(0,0,0,0.02)] flex items-center justify-center px-4 md:px-5 min-w-[90px] md:min-w-[100px] pt-1`}
                                style={{ backgroundColor: tabColor }}
                            >
                                <span className={`font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-black/70 group-hover:text-black transition-colors ${isActive ? 'text-black' : ''}`}>
                                    {category}
                                </span>
                            </div>
                        </button>
                    );
                })}

                <div className="flex-grow min-w-[20px]"></div>

                <div className="flex items-end gap-3 pl-4 -translate-x-[5px]">
                    {RESOURCE_LINKS.map((link) => {
                        const isLink = link.type === 'link';
                        const isCurrentDB = link.type === 'database' && (link.id === currentDatabaseId || (currentDatabaseId === null && link.id === process.env.NOTION_DATABASE_ID));
                        return (
                         <div 
                            key={link.label}
                            onClick={() => isLink ? window.open(link.href, '_blank') : handleResourceClick(link)}
                            className={`relative group h-8 w-16 md:h-9 md:w-[54px] rounded-t-lg border border-black/10 shadow-sm flex items-center justify-center transition-transform translate-y-[8px] hover:translate-y-[4px] z-0 hover:z-40 pt-1 cursor-pointer ${isCurrentDB ? 'bg-white z-50 translate-y-[4px] border-b-white pb-2 shadow-none' : ''}`}
                            style={{ backgroundColor: isCurrentDB ? '#fff' : link.color }}
                         >
                            <span className={`font-mono text-[8px] font-bold tracking-tight whitespace-nowrap ${isCurrentDB ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
                                {link.label}
                            </span>
                         </div>
                    )})}
                </div>
            </div>
        </div>
      </header>

      <main className="flex-grow pl-12 md:px-8 md:pb-12 z-20 md:pt-0">
        <div className="max-w-7xl mx-auto min-h-[100dvh] md:min-h-[85vh] bg-white md:bg-[#FDFBF7] md:rounded-b-lg md:rounded-tr-lg rounded-none shadow-none md:shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative border-t-0 md:border-t border-black/5">
            <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-dashed border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
                            // ARCHIVE_DRAWER_{getDrawerNumber()} / {currentDatabaseLabel}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 mb-2">
                            {activeCategory === '全部' ? `${currentDatabaseLabel} 库` : activeCategory}
                        </h1>
                        <p className="font-mono text-xs text-gray-500 max-w-lg">
                            {loading ? '正在检索档案...' : `已为您呈现 ${displayedSchemes.length} 个深度方案.`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-12 py-12">
                {useMock && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 border-dashed rounded-lg font-mono text-xs flex justify-between items-center text-wrap break-all">
                        <span className="text-yellow-800">⚠️ 预览模式: {debugMsg}</span>
                        <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="underline ml-4 whitespace-nowrap">检查环境变量</a>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {loading && !useMock ? (
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        displayedSchemes.map(scheme => (
                            <ArchiveCard 
                            key={scheme.id} 
                            scheme={scheme} 
                            onClick={() => setSelectedScheme(scheme)}
                            />
                        ))
                    )}
                </div>
                
                {!loading && displayedSchemes.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center font-mono text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 text-center p-8">
                        <p className="mb-2 uppercase tracking-widest">[ 档案为空 ]</p>
                        <p className="text-xs">该分类下暂无已归档方案</p>
                    </div>
                )}

                {!useMock && hasMore && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="group relative overflow-hidden bg-[#e8e4da] text-black font-mono font-bold text-xs px-8 py-3 rounded border border-black/10 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                            {loadingMore ? '正在调取...' : '加载更多档案 +'}
                        </button>
                    </div>
                )}
            </div>

            <div className="relative h-16 bg-white md:bg-[#FDFBF7] md:rounded-b-lg rounded-none border-t border-black/5 mt-auto flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}></div>
                <div className="absolute inset-x-0 bottom-3 h-[2px] bg-black/5 border-b border-white"></div>
                <div className="absolute inset-x-0 bottom-6 h-[2px] bg-black/5 border-b border-white"></div>
                <span className="relative z-10 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                    ThinkPPT Archive System © 2025
                </span>
            </div>
        </div>
      </main>

      <Archivist />
      
      {selectedScheme && (
        <SchemeDetail 
          scheme={selectedScheme} 
          onClose={() => setSelectedScheme(null)} 
          isResourceDb={currentDatabaseId === process.env.NOTION_DB_AI_ID}
        />
      )}
    </div>
  );
}
