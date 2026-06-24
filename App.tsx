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

const STATIC_DATA_ENABLED = process.env.STATIC_DATA_ENABLED === 'true';
const DEMO_MODE = process.env.VITE_DEMO_MODE === 'true';

const MEMBERSHIP_PLANS = [
  {
    name: '单份获取',
    label: '适合临时找方案',
    details: ['确认目标档案后人工开通', '提供对应资料访问权限', '适合先小额验证需求']
  },
  {
    name: '年度会员',
    label: '适合长期查资料',
    details: ['覆盖站内会员档案库', '新增资料持续更新', '可按需备注行业方向']
  },
  {
    name: '项目授权',
    label: '适合团队或商用',
    details: ['按项目确认使用范围', '可提供授权说明', '适合企业内部参考']
  }
];

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

const MembershipPanel: React.FC<{ onSubscribe: () => void }> = ({ onSubscribe }) => (
  <section id="membership" className="px-6 md:px-12 pt-8">
    <div className="border-y border-black/10 bg-white/70">
      <div className="grid lg:grid-cols-[1.05fr_2fr]">
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-black/10">
          <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">MEMBER ACCESS</span>
          <h2 className="mt-2 text-xl md:text-2xl font-heading font-black tracking-tight text-gray-900">个人试运营收款入口</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            目前建议采用人工开通：用户提交需求后，通过微信、支付宝或银行卡转账确认，随后开通资料访问权限。正式商户号上线前不做自动扣款。
          </p>
          <button
            onClick={onSubscribe}
            className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-black bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5"
          >
            申请开通
          </button>
        </div>
        <div className="grid md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan, index) => (
            <div key={plan.name} className={`p-6 md:p-7 ${index > 0 ? 'border-t md:border-t-0 md:border-l' : ''} border-black/10`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-black text-gray-900">{plan.name}</h3>
                <span className="rounded-full border border-black/10 bg-[#FDFBF7] px-2 py-1 font-mono text-[9px] font-bold text-gray-500">{plan.label}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.details.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-relaxed text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black/60"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-black/10 px-6 py-3 font-mono text-[10px] leading-relaxed text-gray-400">
        个人阶段建议先做“付费意向 + 人工收款 + 人工发放权限”，后续再升级为个体户或公司主体的正式在线支付。
      </div>
    </div>
  </section>
);

const normalizeStaticId = (id: string) => id.replace(/-/g, '');

const getStaticDatabaseFile = (databaseId: string | null) => {
  if (databaseId === process.env.NOTION_DB_AI_ID) return '/data/databases/ai.json';
  return '/data/databases/main.json';
};

const getStaticPageFile = (pageId: string) => `/data/pages/${normalizeStaticId(pageId)}.json`;

const uniqueValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const CuratedHomeIntro: React.FC<{ schemes: Scheme[]; onOpenScheme: (scheme: Scheme) => void }> = ({ schemes, onOpenScheme }) => {
  const platforms = uniqueValues(schemes.map(scheme => scheme.platform).filter(value => value !== '未标注平台'));
  const [activePlatform, setActivePlatform] = useState<string>('全部');
  const ipGroups = Array.from(
    schemes.reduce((map, scheme) => {
      const key = `${scheme.platform || '未标注平台'}__${scheme.ipName || scheme.title}`;
      const current = map.get(key) || {
        platform: scheme.platform || '未标注平台',
        ipName: scheme.ipName || scheme.title,
        years: new Set<string>(),
        count: 0,
        type: scheme.projectType || scheme.category,
        schemes: [] as Scheme[],
      };
      current.years.add(scheme.year);
      current.count += 1;
      current.schemes.push(scheme);
      map.set(key, current);
      return map;
    }, new Map<string, { platform: string; ipName: string; years: Set<string>; count: number; type: string; schemes: Scheme[] }>())
  ).sort((a, b) => b[1].count - a[1].count);
  const visibleIpGroups = ipGroups.filter(([, group]) => activePlatform === '全部' || group.platform === activePlatform).slice(0, 6);
  const heroGroup = visibleIpGroups[0]?.[1];
  const heroSchemes = heroGroup?.schemes.slice().sort((a, b) => String(a.year).localeCompare(String(b.year))) || [];

  const years = uniqueValues(schemes.map(scheme => scheme.year)).sort();
  const yearLabel = years.length > 1 ? `${years[0]}-${years[years.length - 1]}` : (years[0] || '持续更新');

  return (
    <section className="border-b border-black/10 bg-[#F4F0E8]">
      <div className="grid min-h-[620px] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative border-b border-black/10 px-6 py-10 md:px-12 lg:border-b-0 lg:border-r lg:py-14">
          <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-black/10 md:block"></div>
          <div className="md:pl-8">
            <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
              <span className="font-mono text-[10px] font-bold text-[#8F2F24] uppercase tracking-[0.32em]">THINKPPT ANNUAL</span>
              <span className="font-mono text-[10px] text-black/35">VOL. {yearLabel}</span>
            </div>
            <h1 className="mt-10 max-w-xl text-[44px] font-heading font-black leading-[0.98] tracking-normal text-[#111111] md:text-[72px]">
              平台 IP<br />营销观察库
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-8 text-[#4D4A45]">
              一本面向策划人与品牌市场部的数字年鉴。持续追踪互联网平台 IP 项目的招商方案、视觉物料、商业权益与年度演进。
            </p>
            <div className="mt-10 grid grid-cols-3 border-y border-black/10">
              {[
                ['平台', platforms.length || '—'],
                ['IP档案', ipGroups.length || '—'],
                ['年份跨度', yearLabel],
              ].map(([label, value], index) => (
                <div key={label} className={`py-5 ${index > 0 ? 'border-l border-black/10 pl-4' : 'pr-4'}`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/35">{label}</div>
                  <div className="mt-2 text-2xl font-black text-[#111111]">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {['全部', ...platforms.slice(0, 8)].map(platform => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${activePlatform === platform ? 'border-[#111111] bg-[#111111] text-[#F4F0E8]' : 'border-black/15 text-black/55 hover:border-black/60 hover:text-black'}`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111111] text-[#F4F0E8]">
          <div className="grid h-full lg:grid-rows-[auto_1fr]">
            <div className="border-b border-white/10 px-6 py-5 md:px-10">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/40">Curated Focus</span>
                <span className="font-mono text-[10px] text-white/35">{activePlatform}</span>
              </div>
            </div>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-white/10 px-6 py-8 md:px-10 lg:border-b-0 lg:border-r">
                {heroGroup ? (
                  <>
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C9694C]">{heroGroup.platform}</div>
                    <h2 className="mt-5 text-3xl font-heading font-black leading-tight md:text-5xl">{heroGroup.ipName}</h2>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {[heroGroup.type, `${heroGroup.count} 份档案`, Array.from(heroGroup.years).sort().join(' / ')].map(item => (
                        <span key={item} className="border border-white/15 px-3 py-1.5 font-mono text-[10px] text-white/55">{item}</span>
                      ))}
                    </div>
                    <p className="mt-8 text-sm leading-8 text-white/62">
                      {heroSchemes[0]?.editorNote || '选择一个平台，查看其连续 IP 的年度招商逻辑、权益变化和物料演进。'}
                    </p>
                    {heroSchemes[0] && (
                      <button
                        onClick={() => onOpenScheme(heroSchemes[0])}
                        className="mt-8 border border-[#C9694C] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F4F0E8] transition-colors hover:bg-[#C9694C] hover:text-[#111111]"
                      >
                        打开代表档案
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm leading-8 text-white/55">在 Notion 增加“平台”和“IP名称”字段后，这里会自动形成可切换的 IP 聚焦面板。</p>
                )}
              </div>
              <div className="px-6 py-8 md:px-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">Annual Timeline</div>
                <div className="mt-8 space-y-0 border-y border-white/10">
                  {heroSchemes.map((scheme, index) => (
                    <button
                      key={scheme.id}
                      onClick={() => onOpenScheme(scheme)}
                      className="grid w-full grid-cols-[64px_1fr] gap-4 border-b border-white/10 py-4 text-left last:border-b-0"
                    >
                      <span className="font-mono text-xs text-[#C9694C]">{scheme.year}</span>
                      <span>
                        <span className="block text-sm font-bold leading-6 text-[#F4F0E8]">{scheme.title}</span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-white/35">{scheme.archiveType || scheme.projectType} / {String(index + 1).padStart(2, '0')}</span>
                      </span>
                    </button>
                  ))}
                  {heroSchemes.length === 0 && (
                    <div className="py-5 text-sm text-white/45">暂无可展示时间线。</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 px-6 py-8 md:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_2.18fr]">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/35">Index of Records</span>
            <p className="mt-3 text-sm leading-7 text-black/55">以平台为索引，以 IP 为单元，让每一份方案进入长期观察序列。</p>
          </div>
          <div className="grid gap-x-8 gap-y-0 md:grid-cols-2">
            {visibleIpGroups.slice(0, 6).map(([, group]) => (
              <button key={`${group.platform}-${group.ipName}`} onClick={() => onOpenScheme(group.schemes[0])} className="grid grid-cols-[1fr_auto] gap-4 border-t border-black/10 py-5 text-left transition-colors hover:text-[#8F2F24]">
                <div>
                  <div className="text-base font-black text-current">{group.ipName}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-black/35">{group.platform} / {group.type}</div>
                </div>
                <div className="text-right font-mono text-[10px] leading-5 text-black/45">
                  <div>{Array.from(group.years).sort().join(' / ')}</div>
                  <div>{group.count} 份档案</div>
                </div>
              </button>
            ))}
            {visibleIpGroups.length === 0 && (
              <div className="py-4 text-sm text-black/45">待补充 IP 字段后自动生成。</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [logoError, setLogoError] = useState(false);
  
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
if (DEMO_MODE) {
  localStorage.removeItem('thinkppt_schemes_cache');
  localStorage.removeItem('thinkppt_categories_cache');
  localStorage.removeItem('thinkppt_schemes_cache_time');
  return;
}
const cachedData = localStorage.getItem('thinkppt_schemes_cache');
const cachedCats = localStorage.getItem('thinkppt_categories_cache');
const cachedTime = localStorage.getItem('thinkppt_schemes_cache_time');
const cacheAge = cachedTime ? Date.now() - parseInt(cachedTime) : Infinity;

if (cachedData && !currentDatabaseId && cacheAge < 40 * 60 * 1000) {
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

  const getDrawerNumber = () => {
    if (currentDatabaseId === process.env.NOTION_DB_AI_ID) return '02';
    const idx = categories.indexOf(activeCategory);
    if (idx === -1) return '01';
    return (idx + 1).toString().padStart(2, '0');
  };

  const fetchSchemes = async (cursor: string | null = null, categoryOverride?: string, dbIdOverride?: string | null) => {
    try {
      if (DEMO_MODE) {
        const currentCategory = categoryOverride !== undefined ? categoryOverride : activeCategory;
        const demoSchemes = currentCategory && currentCategory !== '全部'
          ? MOCK_SCHEMES.filter(scheme => scheme.category === currentCategory)
          : MOCK_SCHEMES;
        setSchemes(demoSchemes);
        setCategories(['全部', ...uniqueValues(MOCK_SCHEMES.map(scheme => scheme.category))]);
        setUseMock(true);
        setNextCursor(null);
        setHasMore(false);
        return;
      }

      const currentCategory = categoryOverride !== undefined ? categoryOverride : activeCategory;
      const targetDbId = dbIdOverride !== undefined ? dbIdOverride : currentDatabaseId;
      
      if (!cursor && schemes.length === 0) setLoading(true);
      if (cursor) setLoadingMore(true);

      const urlParams = new URLSearchParams(window.location.search);
      const isForceRefresh = urlParams.get('refresh') === 'true';

      if (STATIC_DATA_ENABLED) {
        const res = await fetch(getStaticDatabaseFile(targetDbId), { cache: isForceRefresh ? 'reload' : 'default' });
        if (!res.ok) throw new Error('Static database not found');

        const data = await res.json();
        const filteredData = currentCategory && currentCategory !== '全部'
          ? {
              ...data,
              results: (data.results || []).filter((page: any) => {
                const mapped = mapNotionResultToSchemes({ results: [page] })[0];
                return mapped?.category === currentCategory;
              })
            }
          : data;
        const mappedData = mapNotionResultToSchemes(filteredData);

        setCategories(data.categories || DEFAULT_CATEGORIES);
        if (cursor) {
          setSchemes(prev => [...prev, ...mappedData]);
        } else {
          setSchemes(mappedData);
          setUseMock(false);
          if (!targetDbId && currentCategory === '全部') {
            localStorage.setItem('thinkppt_schemes_cache', JSON.stringify(mappedData));
            localStorage.setItem('thinkppt_categories_cache', JSON.stringify(data.categories || DEFAULT_CATEGORIES));
            localStorage.setItem('thinkppt_schemes_cache_time', Date.now().toString());
          }
        }
        setNextCursor(null);
        setHasMore(false);
        return;
      }

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
               localStorage.setItem('thinkppt_schemes_cache_time', Date.now().toString());
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
          const pageUrl = STATIC_DATA_ENABLED ? getStaticPageFile(pageId) : `/api/page?id=${pageId}`;
          const res = await fetch(pageUrl);
          if (res.ok) {
              const pageData = await res.json();
              const mapped = mapNotionResultToSchemes({ results: [pageData] });
              if (mapped.length > 0) setSelectedScheme(mapped[0]);
          }
      } catch (e) { console.error(e); }
  };

  const handleSubscribeClick = () => {
      const subscribePage = RESOURCE_LINKS.find(link => link.label === '订阅' && link.id);
      if (subscribePage?.id) {
          fetchAndOpenPage(subscribePage.id);
      }
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

  // Base list of schemes
  const baseSchemes = useMock 
    ? (activeCategory === '全部' ? schemes : schemes.filter(s => s.category === activeCategory))
    : schemes;

  // Sort: Featured items first
  const displayedSchemes = [...baseSchemes].sort((a, b) => {
    // Treat undefined/null as false
    const aFeatured = !!a.isFeatured;
    const bFeatured = !!b.isFeatured;
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return 0; 
  });

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] lg:bg-[#e8e4da] font-sans text-black relative selection:bg-[#A2D2FF] selection:text-black overflow-x-hidden flex flex-col">
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>

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
                // Updated Palette: Closer shades of beige/kraft
                const paletteColors = [PALETTE.KRAFT_INNER, '#E5DCCB', '#DFD5C4', PALETTE.KRAFT_OUTER];
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
      <header className="hidden lg:block relative z-40 px-8 py-5 pointer-events-auto">
        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-black/10 pb-5">
            <button onClick={() => handleCategoryChange('全部')} className="group flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-black bg-[#111111] text-[#F4F0E8]">
                    <span className="font-heading text-xl font-black">T</span>
                </div>
                <div className="text-left">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-black/35">ThinkPPT</div>
                    <div className="text-sm font-black text-[#111111]">Platform IP Marketing Annual</div>
                </div>
            </button>
            {DEMO_MODE && (
              <div className="border border-[#8F2F24]/30 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F2F24]">
                Annual Demo V2
              </div>
            )}
            <div className="flex items-center gap-1">
                {categories.slice(0, 7).map((category) => {
                    const isActive = activeCategory === category;
                    return (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'bg-[#111111] text-[#F4F0E8]' : 'text-black/45 hover:bg-black/5 hover:text-black'}`}
                        >
                          {category}
                        </button>
                    );
                })}
            </div>
            <div className="flex items-center gap-2">
                {RESOURCE_LINKS.map((link) => {
                    const isCurrentDB = link.type === 'database' && ((link.id === currentDatabaseId) || (currentDatabaseId === null && link.id === process.env.NOTION_DATABASE_ID));
                    return (
                     <button
                       key={link.label}
                       onClick={() => handleResourceClick(link)}
                       className={`border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${isCurrentDB ? 'border-[#8F2F24] text-[#8F2F24]' : 'border-black/10 text-black/45 hover:border-black/40 hover:text-black'}`}
                     >
                        {link.label}
                     </button>
                )})}
            </div>
        </div>
      </header>

      {/* 主内容区 - 移动端背景色改为 #FDFBF7 */}
      <main className="flex-grow pl-12 lg:px-8 lg:pb-12 z-20 pt-0">
        <div className="max-w-7xl mx-auto min-h-[100dvh] lg:min-h-[85vh] bg-[#FDFBF7] lg:bg-[#FDFBF7] rounded-none shadow-none relative border border-black/10">
            {currentDatabaseId === null && activeCategory === '全部' ? (
              <CuratedHomeIntro schemes={displayedSchemes} onOpenScheme={setSelectedScheme} />
            ) : (
              <div className="px-6 md:px-12 pt-12 pb-8 border-b border-black/10 bg-[#F8F5EE]">
                  <div>
                      <span className="font-mono text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest">// ARCHIVE_DRAWER_{getDrawerNumber()} / {currentDatabaseLabel}</span>
                      <h1 className="text-2xl md:text-4xl font-heading font-black uppercase tracking-tight text-gray-900 mb-2">
                          {activeCategory === '全部' ? `${currentDatabaseLabel} 库` : activeCategory}
                      </h1>
                  </div>
              </div>
            )}

            <div className="px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-[62px] md:gap-y-16">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        displayedSchemes.map(scheme => (
                            <ArchiveCard key={scheme.id} scheme={scheme} onClick={() => setSelectedScheme(scheme)} />
                        ))
                    )}
                </div>
                {loadingMore && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-[62px] md:gap-y-16 mt-16">{Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>}
                
                {hasMore && !loading && (
                  <div className="mt-20 flex justify-center">
                    <button onClick={() => fetchSchemes(nextCursor)} disabled={loadingMore} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {loadingMore ? '检索中...' : '加载更多档案'}
                    </button>
                  </div>
                )}
            </div>

            <div className="relative h-16 bg-[#FDFBF7] lg:bg-[#FDFBF7] lg:rounded-b-lg rounded-none border-t border-black/5 mt-auto flex items-center justify-center">
                <span className="px-4 text-center font-mono text-[10px] text-gray-400 uppercase tracking-widest"><a className="text-color" href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">陕ICP备2026004104号</a> © ThinkPPT.COM Power by Notion / 个人试运营阶段人工确认开通</span>
            </div>
        </div>
      </main>

      <Archivist schemes={schemes} onOpenScheme={setSelectedScheme} />
      {selectedScheme && <SchemeDetail scheme={selectedScheme} onClose={() => setSelectedScheme(null)} isResourceDb={currentDatabaseId === process.env.NOTION_DB_AI_ID} onSubscribe={handleSubscribeClick} staticDataMode={STATIC_DATA_ENABLED} />}
    </div>
  );
}
