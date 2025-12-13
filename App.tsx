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
 * 右上角仅展示 3 个标签：AI (数据库), 关于 (页面), 订阅 (页面)
 */
const RESOURCE_LINKS: ResourceLink[] = [
  // 1. [AI] - 切换到 AI 数据库
  { 
    label: 'AI', 
    type: 'database', 
    id: process.env.NOTION_DB_AI_ID, 
    color: '#FFF6BD' // 黄色系 (Kept high viz for navigation)
  },

  // 2. [关于] - 独立 Notion 页面
  { 
    label: '关于', 
    type: 'page', 
    id: process.env.NOTION_PAGE_ABOUT_ID, 
    color: '#e5e7eb' // 灰色系
  },

  // 3. [订阅] - 独立 Notion 页面
  { 
    label: '订阅', 
    type: 'page', 
    id: process.env.NOTION_PAGE_SUBSCRIBE_ID, 
    color: '#A2D2FF' // 蓝色系
  }
];

// 2. 品牌/Logo 配置
const BRAND_CONFIG = {
  // 模式: 'image' (图片Logo) 或 'text' (文字Logo)
  mode: 'image', 
  
  // 文字模式下的内容
  text: 'ThinkPPT',
  
  // 图片模式下的 URL 地址
  // 将您的 logo.png 图片放入项目根目录下的 'public' 文件夹中
  logoUrl: '/logo.png',
  
  // 图片的高度 (Tailwind class, e.g., 'h-6', 'h-8')
  heightClass: 'h-8' 
};

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

// --- FLOATING FOLDER COMPONENT (For Background) ---
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
            boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', // Soft realistic shadow
            ...style,
            animation: `float 6s ease-in-out infinite ${delay}`
        }}
    >
        {/* Flap Detail */}
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 rounded-t-lg border-b border-black/5"></div>
        
        {/* String Button */}
        <div className="absolute top-[40%] -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm z-10 border border-black/5 flex items-center justify-center">
             <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* String Hanging */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[1px] h-4 bg-white/60"></div>
    </div>
);

export default function App() {
  const [isSealed, setIsSealed] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [logoError, setLogoError] = useState(false); // Track if logo failed to load
  
  // Navigation State
  const [activeCategory, setActiveCategory] = useState('全部');
  const [categories, setCategories] = useState<string[]>(['全部']); // Start with default, will populate from API
  const [currentDatabaseId, setCurrentDatabaseId] = useState<string | null>(null); // Null means use default from ENV
  const [currentDatabaseLabel, setCurrentDatabaseLabel] = useState('方案'); // Track visible label name
  
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

  // Background Folders Configuration for the Opening Animation
  // Updated to use the new Richer MORANDI Palette from constants
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

  // Remove Overlay from DOM after transition
  useEffect(() => {
    if (!isSealed) {
        const timer = setTimeout(() => {
            setShowOverlay(false);
        }, 1200); // Wait for transition duration + buffer
        return () => clearTimeout(timer);
    }
  }, [isSealed]);

  // Dynamic Drawer Number Helper
  const getDrawerNumber = () => {
    // If viewing AI or other DBs, maybe use a fixed high number or calculated based on type
    if (currentDatabaseId === process.env.NOTION_DB_AI_ID) return '02';
    
    // Default Scheme Database: Map category index to drawer number
    const idx = categories.indexOf(activeCategory);
    if (idx === -1) return '01';
    return (idx + 1).toString().padStart(2, '0');
  };

  // Fetch Data Function
  // Added 'dbIdOverride' to support switching databases
  const fetchSchemes = async (cursor: string | null = null, categoryOverride?: string, dbIdOverride?: string | null) => {
    try {
      const currentCategory = categoryOverride !== undefined ? categoryOverride : activeCategory;
      // If dbIdOverride is passed, use it. Otherwise use state. If state is null, backend uses default ENV.
      const targetDbId = dbIdOverride !== undefined ? dbIdOverride : currentDatabaseId;

      if (cursor) {
          setLoadingMore(true);
      } else {
          setLoading(true);
      }

      // Construct URL
      let url = `/api/schemes`;
      const params = new URLSearchParams();
      
      if (cursor) params.append('cursor', cursor);
      if (currentCategory && currentCategory !== '全部') params.append('category', currentCategory);
      if (targetDbId) params.append('db_id', targetDbId);

      const fullUrl = `${url}?${params.toString()}`;

      const res = await fetch(fullUrl);
      
      if (res.status === 401) {
           console.warn("Notion API Key missing.");
           setDebugMsg("请在 Vercel 环境变量中配置 NOTION_API_KEY");
           setSchemes(MOCK_SCHEMES);
           setCategories(DEFAULT_CATEGORIES); // Fallback to hardcoded categories
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
               setCategories(DEFAULT_CATEGORIES);
               setUseMock(true);
               setHasMore(false);
           }
      } else {
           const data = await res.json();
           const mappedData = mapNotionResultToSchemes(data);
            
           // Update dynamic categories from API if available
           // Only update categories if we are loading the initial set (no cursor)
           if (!cursor && data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories(data.categories);
              
              // If the current active category doesn't exist in the new DB, reset to '全部'
              if (activeCategory !== '全部' && !data.categories.includes(activeCategory)) {
                  setActiveCategory('全部');
              }
           }

           if (!cursor && mappedData.length === 0) {
               if (!useMock) {
                  // Valid response but empty database
                  setSchemes([]); 
               } else {
                   setSchemes(MOCK_SCHEMES);
               }
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
        setCategories(DEFAULT_CATEGORIES);
        setUseMock(true);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch a single page and open it
  const fetchAndOpenPage = async (pageId: string) => {
      // Show global loading if needed, or just open a loading modal
      // For now, we'll just fetch and set selectedScheme
      try {
          // Optional: Show loading indicator
          const res = await fetch(`/api/page?id=${pageId}`);
          if (res.ok) {
              const pageData = await res.json();
              // mapNotionResultToSchemes expects an array with 'results' wrapper
              // We simulate that structure for a single item
              const mapped = mapNotionResultToSchemes({ results: [pageData] });
              if (mapped.length > 0) {
                  setSelectedScheme(mapped[0]);
              }
          } else {
              alert('无法加载该页面，请检查页面 ID 和 Notion 连接配置。');
          }
      } catch (e) {
          console.error(e);
          alert('页面加载失败');
      }
  };

  useEffect(() => {
    fetchSchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleLoadMore = () => {
    if (nextCursor && !loadingMore) {
        fetchSchemes(nextCursor);
    }
  };

  const handleCategoryChange = (category: string) => {
      // If clicking "全部" (Logo or first tab), and we are NOT on the main DB, switch back to main DB
      if (category === '全部' && currentDatabaseId !== null) {
          handleReturnToMainDb();
          return;
      }

      if (activeCategory === category) return;
      
      setActiveCategory(category);
      setSchemes([]); // Clear current list immediately
      setNextCursor(null);
      setHasMore(false);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Trigger fetch with new category
      fetchSchemes(null, category);
  };

  // New handler to reset to default DB (Scheme Archive)
  const handleReturnToMainDb = () => {
     // If we are already on main (null) or explicit main ID, just reset category
     if (currentDatabaseId === null) {
         if (activeCategory !== '全部') {
             setActiveCategory('全部');
             setSchemes([]);
             setNextCursor(null);
             fetchSchemes(null, '全部');
         }
         return;
     }

     setCurrentDatabaseId(null); // null means use default ENV (Schemes)
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
          // Switch Database
          
          // Check if we are already on this database
          const isDefaultDB = resource.id === process.env.NOTION_DATABASE_ID;
          const isOnDefaultNow = currentDatabaseId === null || currentDatabaseId === process.env.NOTION_DATABASE_ID;

          if (resource.id === currentDatabaseId || (isDefaultDB && isOnDefaultNow)) {
             return; 
          }
          
          setCurrentDatabaseId(resource.id);
          setCurrentDatabaseLabel(resource.label); // Update the visual label
          setActiveCategory('全部'); // Reset category
          setSchemes([]);
          setNextCursor(null);
          setHasMore(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Force fetch with new ID
          fetchSchemes(null, '全部', resource.id);
          
      } else if (resource.type === 'page' && resource.id) {
          // Open Single Page
          fetchAndOpenPage(resource.id);
      } else {
          // Normal Link
          // Handled by <a> tag default behavior if href is present
      }
  };

  // If using Mock data, we filter client-side. 
  // If using real API, 'schemes' already contains filtered data from server.
  const displayedSchemes = useMock 
    ? (activeCategory === '全部' ? schemes : schemes.filter(s => s.category === activeCategory))
    : schemes;

  return (
    <div className="min-h-[100dvh] bg-transparent md:bg-[#e8e4da] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden flex flex-col">
      
      {/* Define Keyframes for Floating Animation */}
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

      {/* Background Texture (The Desk) - Hidden on Mobile */}
      <div className="hidden md:block fixed inset-0 pointer-events-none opacity-40 z-0" 
           style={{ backgroundImage: 'radial-gradient(#a39f94 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* =========================================================================
          1. NEW LOADING OVERLAY (3D Floating Folders)
         ========================================================================= */}
      {showOverlay && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#ffffff] transition-all duration-700 ease-in-out ${!isSealed ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Background Container for Floating Elements (Perspective) */}
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

            {/* Central Rich Morandi Folder */}
            <div 
                onClick={() => setIsSealed(false)}
                className="relative z-50 cursor-pointer group"
                style={{ animation: 'float-central 5s ease-in-out infinite' }}
            >
                <div 
                    className="w-[320px] h-[240px] md:w-[480px] md:h-[340px] rounded-lg flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105 relative"
                    style={{ 
                        backgroundColor: '#01847E', // UPDATED: Mars Green
                        // Enhanced Realistic Shadow with matching tint
                        boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(1, 132, 126, 0.4)'
                    }}
                >
                    {/* Folder Flap (Lighter) */}
                    <div className="absolute top-0 left-0 right-0 h-[35%] bg-white/10 rounded-t-lg border-b border-black/5"></div>

                    {/* Logo/Brand Area - Text Only */}
                    {/* UPDATED: Decreased margin-top from mt-24 to mt-14 to place text just below the buckle */}
                    <div className="relative z-20 flex flex-col items-center justify-center mt-14">
                         <h1 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter drop-shadow-sm select-none translate-y-[8px]">
                             ThinkPPT
                         </h1>
                         {/* UPDATED: Added subtitle */}
                         <span className="text-white/80 text-xs md:text-sm font-bold tracking-widest mt-2 translate-y-[8px]">
                            ﹝深刻PPT﹞
                         </span>
                    </div>

                    {/* String Closure Mechanism */}
                    <div className="absolute top-[35%] -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30">
                        {/* UPDATED: Slogan Text - White/80 for better contrast on #7299AA */}
                        <span className="absolute -top-7 whitespace-nowrap text-[10px] text-white/80 font-mono tracking-widest font-bold">
                            策划人的方案档案库
                        </span>

                        {/* Top Button */}
                        <div className="w-5 h-5 md:w-7 md:h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full"></div>
                        </div>
                        {/* String Line */}
                        <div className="w-0.5 h-6 md:h-10 bg-white/80"></div>
                        {/* Bottom Button */}
                        <div className="w-5 h-5 md:w-7 md:h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="absolute bottom-6 text-white/90 font-mono text-xs uppercase tracking-widest animate-pulse font-bold">
                        {loading ? 'Loading Archives...' : 'Click to Open'}
                    </div>

                </div>
            </div>

        </div>
      )}


      {/* =========================================================================
          2.0 MOBILE SIDEBAR NAVIGATION (Vertical Tabs)
          Visible only on mobile/tablet (hidden md)
          UPDATED: Aligned to top, padding removed (pt-0)
         ========================================================================= */}
      <nav className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-start items-start pointer-events-none pb-4 pt-0 w-12">
        <div className="flex flex-col gap-1 pointer-events-auto items-start">
            
            {/* LOGO TAB (Home/All) - Distinct & Larger */}
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
                         {/* 手机端 Logo 顺时针旋转 90 度 (rotate-90)，尺寸缩小为 h-4 并限制 max-w 以防止溢出 */}
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

            {/* Categories (Skip '全部' as it's the logo) */}
            {categories.filter(c => c !== '全部').map((category, idx) => {
                const isActive = activeCategory === category;
                // Use original index logic for color consistency
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
                        <span 
                            className={`
                                block [writing-mode:vertical-rl] 
                                font-mono text-[10px] font-bold tracking-widest
                                ${isActive ? 'text-black' : 'text-black/60'}
                            `}
                        >
                            {category}
                        </span>
                    </button>
                );
            })}
            
            {/* Divider */}
            <div className="h-2"></div>

            {/* Utility Links (Vertical) - Smallest */}
            {RESOURCE_LINKS.map((link) => {
                // Remove strict check so UI shows up for testing
                // if (!link.id && link.type === 'database') return null;
                
                const isCurrentDB = link.type === 'database' && link.id === currentDatabaseId;

                return (
                <button 
                    key={link.label}
                    onClick={() => {
                        if (link.type === 'link') {
                            window.open(link.href, link.href?.startsWith('http') ? '_blank' : '_self');
                        } else {
                            handleResourceClick(link);
                        }
                    }}
                    // UPDATED: Removed border-l-black, applied background color logic for active state
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

      {/* =========================================================================
          2.1 DESKTOP NAVIGATION (Horizontal Tabs)
          Visible only on desktop (hidden md:block)
         ========================================================================= */}
      <header className="hidden md:block relative w-full z-40 px-2 md:px-8 pt-4 md:pt-6 pointer-events-auto">
        <div className="max-w-7xl mx-auto relative pointer-events-auto">
            
            <div className="flex items-end overflow-x-auto w-full no-scrollbar relative" style={{ scrollbarWidth: 'none' }}>
                
                {/* 2.0 LOGO TAB - CONFIGURABLE */}
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

                {/* 2.1 DYNAMIC CATEGORY TABS */}
                {categories.map((category, idx) => {
                    const isActive = activeCategory === category;
                    const tabColor = PALETTE[idx % PALETTE.length];
                    const heightClass = isActive 
                        ? 'h-11 translate-y-[4px] z-40' 
                        : 'h-11 translate-y-[8px] hover:translate-y-[4px] z-10 hover:z-20'; 
                    const opacityClass = isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100';
                    
                    return (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`
                                relative group flex-shrink-0 mr-[-8px] 
                                px-0 transition-all duration-200 ease-out
                                ${heightClass} ${opacityClass}
                            `}
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

                {/* 2.2 UTILITY TABS (Databases & Links) */}
                <div className="flex items-end gap-3 pl-4 -translate-x-[5px]">
                    {RESOURCE_LINKS.map((link) => {
                        // REMOVED STRICT CHECK: Ensure tabs render even if ENV vars are missing temporarily
                        // if (!link.id && link.type === 'database') return null; 

                        const isLink = link.type === 'link';
                        const Tag = isLink ? 'a' : 'button';
                        const props = isLink 
                            ? { href: link.href, target: link.href?.startsWith('http') ? "_blank" : "_self", rel: "noreferrer" }
                            : { onClick: () => handleResourceClick(link) };
                        
                        // Check if this DB is currently active (Visual feedback)
                        const isCurrentDB = link.type === 'database' && (
                            (link.id === currentDatabaseId) || 
                            (currentDatabaseId === null && link.id === process.env.NOTION_DATABASE_ID)
                        );

                        return (
                         <Tag 
                            key={link.label}
                            {...props}
                            className={`
                                relative group 
                                h-8 w-16 md:h-9 md:w-[54px] 
                                rounded-t-lg border border-black/10 shadow-sm 
                                flex items-center justify-center 
                                transition-transform translate-y-[8px] hover:translate-y-[4px] 
                                z-0 hover:z-40 pt-1 cursor-pointer
                                ${isCurrentDB ? 'bg-white z-50 translate-y-[4px] border-b-white pb-2 shadow-none' : ''}
                            `}
                            style={{ backgroundColor: isCurrentDB ? '#fff' : link.color }}
                         >
                            <span className={`font-mono text-[8px] font-bold tracking-tight whitespace-nowrap ${isCurrentDB ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
                                {link.label}
                            </span>
                         </Tag>
                    )})}
                </div>
            </div>
        </div>
      </header>


      {/* =========================================================================
          3. MAIN CONTENT (The Folder Body)
          UPDATED: Mobile full screen mode (removed padding/margins)
          UPDATED DESKTOP: md:px-8 aligned with header
         ========================================================================= */}
      <main className="flex-grow pl-12 md:px-8 md:pb-12 z-20 md:pt-0">
        
        {/* The "Paper" Container connected to tabs 
            UPDATED: Mobile full height, no rounded corners, no top border, WHITE BG on Mobile
        */}
        <div className="max-w-7xl mx-auto min-h-[100dvh] md:min-h-[85vh] bg-white md:bg-[#FDFBF7] md:rounded-b-lg md:rounded-tr-lg rounded-none shadow-none md:shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_0_rgba(0,0,0,0.1)] relative border-t-0 md:border-t border-black/5">
            
            {/* Visual Header Inside Folder */}
            <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-dashed border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">
                            {/* UPDATED: Dynamic Drawer Number */}
                            // ARCHIVE_DRAWER_{getDrawerNumber()} / {currentDatabaseLabel}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 mb-2">
                            {activeCategory === '全部' ? `${currentDatabaseLabel} 库` : activeCategory}
                        </h1>
                        <p className="font-mono text-xs text-gray-500 max-w-lg">
                            {loading ? '正在检索文件...' : `已检索到 ${displayedSchemes.length} 个档案.`}
                        </p>
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
                        Array(48).fill(0).map((_, i) => <SkeletonCard key={i} />)
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
                        <p className="mb-2 uppercase tracking-widest">[ 空文件夹 ]</p>
                        <p className="text-xs">该分类下暂无已归档档案</p>
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
            <div className="relative h-16 bg-white md:bg-[#FDFBF7] md:rounded-b-lg rounded-none border-t border-black/5 mt-auto flex items-center justify-center overflow-hidden">
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
          isResourceDb={currentDatabaseId === process.env.NOTION_DB_AI_ID}
        />
      )}

    </div>
  );
}