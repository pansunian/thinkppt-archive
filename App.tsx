import React, { useEffect, useMemo, useState } from 'react';

type PageVersion = {
  year: string;
  title: string;
  summary: string;
  dir: string;
  pages: string[];
  labels: string[];
};

type IpAnnual = {
  platform: string;
  name: string;
  type: string;
  text: string;
  thesis: string;
  metrics: { label: string; value: string }[];
  studyNotes: string[];
  audience: string[];
  versions: PageVersion[];
};

const root = '/scheme-pages/xiaohongshu/manrenjie';

const annualData: IpAnnual[] = [
  {
    platform: '小红书',
    name: '慢人节',
    type: '生活方式情绪 IP',
    text: '把“慢生活”从情绪标签包装成可招商、可传播、可连续迭代的平台 IP。',
    thesis: '它的价值不在单次活动，而在小红书把一种生活情绪做成年度品牌资源：从人群共鸣、内容场景到线下目的地，形成可持续售卖的 IP 资产。',
    metrics: [
      { label: '版本谱系', value: '3' },
      { label: '已提取页面', value: '24' },
      { label: '观察跨度', value: '2024-2025' },
    ],
    studyNotes: ['情绪先行：先定义“慢人”人群，再推导活动表达。', '平台资产化：把内容趋势包装成品牌可买的年度资源。', '版本迭代：从通案到 2.0 再到长线规划，能看到 IP 如何被长期经营。'],
    audience: ['生活方式品牌', '文旅目的地', '城市商业体', '饮品与户外品牌'],
    versions: [
      {
        year: '2024 1.0',
        title: '2024小红书慢人节招商通案',
        summary: '从完整 PDF 自动提取的真实页面：先看封面、叙事开篇、趋势和核心页。',
        dir: `${root}/2024-tongan`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构'],
      },
      {
        year: '2024 2.0',
        title: '小红书2024慢人节2.0营销方案',
        summary: '从 2.0 版本 PDF 自动提取的真实页面：用于对比 IP 叙事如何迭代。',
        dir: `${root}/2024-2`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构'],
      },
      {
        year: '2025 3.0',
        title: '小红书慢人节2025年长线IP规划',
        summary: '从 2025 长线规划 PDF 自动提取的真实页面：用于观察一个 IP 如何延展成年度资产。',
        dir: `${root}/2025-planning`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构'],
      },
    ],
  },
  {
    platform: '小红书',
    name: '遛遛生活',
    type: '城市市集 IP',
    text: '城市散步、市集和线下体验如何变成平台招商项目。后续上传 PDF 后，这里会自动展开完整页面。',
    thesis: '适合观察小红书如何把城市生活方式、社区市集和线下漫游包装成品牌可参与的场景资产。',
    metrics: [
      { label: '版本谱系', value: '待接入' },
      { label: '已提取页面', value: '0' },
      { label: '观察方向', value: '城市生活' },
    ],
    studyNotes: ['适合拆解城市散步、社区生活和品牌快闪的连接方式。', '后续可补充线下动线、品牌摊位和内容传播结构。'],
    audience: ['城市商业', '本地生活', '咖啡酒饮', '户外休闲'],
    versions: [],
  },
  {
    platform: '小红书',
    name: '闪光青春派',
    type: '校园 IP',
    text: '校园开学季如何被包装成年度营销资产。后续上传 PDF 后，这里会自动展开完整页面。',
    thesis: '适合观察校园节点如何从一次开学季 Campaign 变成面向年轻人群的内容共创资产。',
    metrics: [
      { label: '版本谱系', value: '待接入' },
      { label: '已提取页面', value: '0' },
      { label: '观察方向', value: '校园人群' },
    ],
    studyNotes: ['重点看人群语言、校园场景和品牌权益如何组合。', '后续可沉淀“开学季 IP”的通用方案结构。'],
    audience: ['3C 数码', '美妆个护', '饮料零食', '校园服务'],
    versions: [],
  },
  {
    platform: '抖音',
    name: '节气 IP',
    type: '传统文化节点 IP',
    text: '用二十四节气搭建全年内容日历和品牌种草资产。后续上传 PDF 后，这里会自动展开完整页面。',
    thesis: '适合观察抖音如何把节气从内容节点升级为全年营销日历，让品牌在固定时间窗口持续借势。',
    metrics: [
      { label: '版本谱系', value: '待接入' },
      { label: '已提取页面', value: '0' },
      { label: '观察方向', value: '节点营销' },
    ],
    studyNotes: ['适合拆解节令话题、达人内容和品牌种草之间的组合。', '后续可按春夏秋冬做时间线导航。'],
    audience: ['食品饮料', '美妆护肤', '新中式品牌', '文旅商家'],
    versions: [],
  },
  {
    platform: '快手',
    name: '春节 IP',
    type: '春节节点 IP',
    text: '春节流量如何变成晚会、互动和品牌资源包。后续上传 PDF 后，这里会自动展开完整页面。',
    thesis: '适合观察春节这个超级节点如何被拆成内容晚会、互动任务、品牌资源包和用户参与机制。',
    metrics: [
      { label: '版本谱系', value: '待接入' },
      { label: '已提取页面', value: '0' },
      { label: '观察方向', value: '春节大促' },
    ],
    studyNotes: ['重点看平台大节点如何承接品牌曝光和用户互动。', '后续可补充晚会、红包、任务玩法等模块。'],
    audience: ['大众消费', '电商平台', '游戏娱乐', '本地生活'],
    versions: [],
  },
  {
    platform: 'BILIBILI',
    name: '拜年纪',
    type: '内容 IP',
    text: '社区内容、UP 主生态与春节节点合作方式。后续上传 PDF 后，这里会自动展开完整页面。',
    thesis: '适合观察 B 站如何把社区文化、UP 主生态和春节节点融合成有平台辨识度的内容 IP。',
    metrics: [
      { label: '版本谱系', value: '待接入' },
      { label: '已提取页面', value: '0' },
      { label: '观察方向', value: '社区内容' },
    ],
    studyNotes: ['适合拆解内容社区的品牌合作边界。', '后续可补充 UP 主、节目单和内容商业化结构。'],
    audience: ['游戏动漫', '数码科技', '年轻消费', '内容品牌'],
    versions: [],
  },
];

const fallbackVersion = (archive: IpAnnual): PageVersion => ({
  year: '待接入',
  title: `${archive.name} PDF 待接入`,
  summary: archive.text,
  dir: '',
  pages: ['', '', '', ''],
  labels: ['封面', '洞察', '主题', '脉络'],
});

const imageFor = (version: PageVersion, pageIndex: number) => {
  if (!version.dir || !version.pages[pageIndex]) return '';
  return `${version.dir}/page-${version.pages[pageIndex]}.jpg`;
};

export default function App() {
  const platforms = useMemo(() => ['全部', ...Array.from(new Set(annualData.map(item => item.platform)))], []);
  const [activePlatform, setActivePlatform] = useState('全部');
  const [activeIp, setActiveIp] = useState(0);
  const [activeVersion, setActiveVersion] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [readerOpen, setReaderOpen] = useState(false);
  const [copyState, setCopyState] = useState('复制链接');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ipName = params.get('ip');
    if (!ipName) return;

    const archiveIndex = annualData.findIndex(item => item.name === ipName);
    if (archiveIndex < 0) return;

    const targetArchive = annualData[archiveIndex];
    const versionName = params.get('version');
    const versionIndex = targetArchive.versions.findIndex(item => item.year === versionName);
    const resolvedVersionIndex = versionIndex >= 0 ? versionIndex : 0;
    const resolvedVersion = targetArchive.versions[resolvedVersionIndex] || fallbackVersion(targetArchive);
    const pageNumber = Number(params.get('page') || '1');

    setActivePlatform('全部');
    setActiveIp(archiveIndex);
    setActiveVersion(resolvedVersionIndex);
    setActivePage(Math.min(Math.max(pageNumber - 1, 0), resolvedVersion.labels.length - 1));
  }, []);

  const filtered = annualData.filter(item => activePlatform === '全部' || item.platform === activePlatform);
  const archive = filtered[activeIp] || filtered[0] || annualData[0];
  const versions = archive.versions.length ? archive.versions : [fallbackVersion(archive)];
  const version = versions[activeVersion] || versions[0];
  const activeImage = imageFor(version, activePage);
  const totalPages = versions.reduce((sum, item) => sum + item.labels.length, 0);
  const shareUrl = typeof window === 'undefined'
    ? ''
    : `${window.location.origin}${window.location.pathname}?ip=${encodeURIComponent(archive.name)}&version=${encodeURIComponent(version.year)}&page=${activePage + 1}`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReaderOpen(false);
      if (event.key === 'ArrowRight') setActivePage(page => Math.min(page + 1, version.labels.length - 1));
      if (event.key === 'ArrowLeft') setActivePage(page => Math.max(page - 1, 0));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [version.labels.length]);

  const selectPlatform = (platform: string) => {
    setActivePlatform(platform);
    setActiveIp(0);
    setActiveVersion(0);
    setActivePage(0);
  };

  const selectIp = (index: number) => {
    setActiveIp(index);
    setActiveVersion(0);
    setActivePage(0);
  };

  const selectVersion = (index: number) => {
    setActiveVersion(index);
    setActivePage(0);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('已复制');
      window.setTimeout(() => setCopyState('复制链接'), 1600);
    } catch {
      setCopyState('复制失败');
      window.setTimeout(() => setCopyState('复制链接'), 1600);
    }
  };

  return (
    <main className="annual-app">
      <style>{styles}</style>

      <header className="top">
        <div className="brand">
          <div className="mark">T</div>
          <div>
            <small>THINKPPT</small>
            <b>PPT Marketing Annual</b>
          </div>
        </div>
        <nav className="chapters" aria-label="平台筛选">
          {platforms.map(platform => (
            <button
              key={platform}
              className={platform === activePlatform ? 'active' : ''}
              onClick={() => selectPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </nav>
        <div className="meta">2024-2026<br />IP SCHEME ANNUAL</div>
      </header>

      <nav className="shelf" aria-label="IP 年鉴目录">
        {filtered.map((item, index) => (
          <button
            key={`${item.platform}-${item.name}`}
            className={`ip-card ${index === activeIp ? 'active' : ''}`}
            onClick={() => selectIp(index)}
          >
            <small>{String(index + 1).padStart(2, '0')}</small>
            <b>{item.name}</b>
            <span>{item.platform} / {item.type}</span>
          </button>
        ))}
      </nav>

      <section className="spread">
        <aside className="story">
          <div>
            <div className="eyebrow">Annual Feature</div>
            <h1>{archive.name}</h1>
            <p>{archive.text}</p>
            <div className="research-card">
              <span>策划人读法</span>
              <strong>{archive.thesis}</strong>
              <ul>
                {archive.studyNotes.map(note => <li key={note}>{note}</li>)}
              </ul>
            </div>
          </div>
          <div />
          <div className="info-grid">
            {archive.metrics.map(metric => (
              <div key={metric.label}><b>{metric.value}</b><span>{metric.label}</span></div>
            ))}
          </div>
          <div className="audience">
            <span>适合参考</span>
            <div>
              {archive.audience.map(item => <b key={item}>{item}</b>)}
            </div>
          </div>
          <div className="site-note">
            <b>THINKPPT</b>
            <span>Platform IP Scheme Annual</span>
            <p>一个面向策划人和品牌市场部的互联网平台 IP 方案年鉴。未来可登录获取研究资料、完整 PDF 与批量下载包。</p>
          </div>
        </aside>

        <section className="feature">
          <div className="feature-head">
            <div>
              <div className="eyebrow">{archive.platform} / {archive.type}</div>
              <h2>{version.title}</h2>
              <p>{version.summary}</p>
            </div>
            <div className="count">
              {String(activePage + 1).padStart(2, '0')} / {String(version.labels.length).padStart(2, '0')}
              <br />
              {version.year}
            </div>
          </div>

          <div className="stage">
            <button className="main-image" onClick={() => activeImage && setReaderOpen(true)}>
              {activeImage ? (
                <img src={activeImage} alt={version.labels[activePage]} />
              ) : (
                <div className="placeholder">
                  <span>{archive.platform}</span>
                  <strong>{archive.name}</strong>
                  <span>{version.labels[activePage]} / PDF 待接入</span>
                </div>
              )}
              <span className="zoom-hint">打开全屏阅读</span>
            </button>

            <div className="thumbs" aria-label="PDF 页面缩略图">
              {version.labels.map((label, index) => {
                const thumb = imageFor(version, index);
                return (
                  <button
                    key={`${version.year}-${label}-${index}`}
                    className={index === activePage ? 'active' : ''}
                    onClick={() => setActivePage(index)}
                  >
                    {thumb ? (
                      <img src={thumb} alt={label} />
                    ) : (
                      <div className="placeholder thumb-placeholder">
                        <span>{label}</span>
                        <strong>{archive.name}</strong>
                      </div>
                    )}
                    <span>{String(index + 1).padStart(2, '0')} / {label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="caption">
            <div>
              <b>{version.labels[activePage]}</b>
              <span>{version.year} / {version.title}</span>
            </div>
            <div className="tools">
              <button onClick={() => activeImage && setReaderOpen(true)}>全屏阅读</button>
              <button onClick={copyShareLink}>{copyState}</button>
              <button className="locked">研究资料</button>
              <div className="version">
                {versions.map((item, index) => (
                  <button
                    key={`${item.year}-${item.title}`}
                    className={index === activeVersion ? 'active' : ''}
                    onClick={() => selectVersion(index)}
                  >
                    {item.year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      {readerOpen && activeImage && (
        <section className="reader" role="dialog" aria-modal="true" aria-label="PDF 全屏阅读">
          <div className="reader-top">
            <div>
              <span>{archive.name} / {version.year}</span>
              <b>{version.labels[activePage]}</b>
            </div>
            <button onClick={() => setReaderOpen(false)}>关闭</button>
          </div>
          <button className="reader-nav prev" onClick={() => setActivePage(page => Math.max(page - 1, 0))}>上一页</button>
          <img src={activeImage} alt={`${version.title} ${version.labels[activePage]}`} />
          <button className="reader-nav next" onClick={() => setActivePage(page => Math.min(page + 1, version.labels.length - 1))}>下一页</button>
          <div className="reader-bottom">{String(activePage + 1).padStart(2, '0')} / {String(version.labels.length).padStart(2, '0')}</div>
        </section>
      )}
    </main>
  );
}

const styles = `
@font-face{
  font-family:"EarlySummerTitle";
  src:url("/fonts/EarlySummerSerif-Regular.woff") format("woff");
  font-weight:400 900;
  font-style:normal;
  font-display:swap;
}
@font-face{
  font-family:"EarlySummerText";
  src:url("/fonts/EarlySummerSerif-light.woff") format("woff");
  font-weight:300 600;
  font-style:normal;
  font-display:swap;
}
:root{
  --paper:#eee7da;
  --sheet:#fffaf0;
  --ink:#11100e;
  --muted:#746d63;
  --line:rgba(17,16,14,.14);
  --red:#9d382e;
  --dark:#12110f;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
  --text:"EarlySummerText","PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif;
  --display:"EarlySummerTitle","Songti SC","STSong",Georgia,serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--text);letter-spacing:0}
button{font:inherit;color:inherit}
.annual-app{height:100svh;padding:18px;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:12px;background:var(--paper);overflow:hidden}
.top{display:grid;grid-template-columns:250px 1fr auto;gap:22px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:12px}
.brand{display:flex;align-items:center;gap:13px}
.mark{width:42px;height:42px;background:var(--ink);color:var(--sheet);display:grid;place-items:center;font:700 28px var(--display)}
.eyebrow,.brand small,.meta,.chapters button,.ip-card small,.version button,.count{font:800 10px var(--mono);letter-spacing:.22em;text-transform:uppercase}
.brand small{color:var(--muted);display:block}
.brand b{display:block;margin-top:3px;font-size:17px}
.chapters{display:flex;gap:8px;overflow:auto}
.chapters button,.version button{border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;white-space:nowrap}
.chapters button.active,.chapters button:hover{background:var(--ink);color:var(--sheet);border-color:var(--ink)}
.meta{color:var(--muted);text-align:right;line-height:1.6}
.shelf{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;border-bottom:1px solid var(--line);padding-bottom:12px}
.ip-card{min-height:64px;border:1px solid var(--line);background:rgba(255,250,240,.72);padding:10px 12px;cursor:pointer;text-align:left;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;column-gap:10px;row-gap:5px;align-items:center;transition:.18s ease}
.ip-card.active,.ip-card:hover{background:var(--sheet);border-color:var(--red);transform:translateY(-2px)}
.ip-card small{color:var(--red);align-self:start;padding-top:3px}
.ip-card b{font:800 20px/1.05 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:0}
.ip-card span{grid-column:2;color:var(--muted);font-size:11px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spread{min-height:0;display:grid;grid-template-columns:330px minmax(0,1fr);gap:14px;overflow:hidden}
.story{background:var(--sheet);border:1px solid var(--line);padding:22px;display:grid;grid-template-rows:auto auto auto auto;align-content:start;gap:18px;min-width:0;min-height:0;overflow:auto}
.story .eyebrow{color:var(--red)}
.story h1{margin:12px 0 0;font:800 52px/1.02 var(--display);letter-spacing:0}
.story p{margin:16px 0 0;color:var(--muted);font-size:14px;line-height:1.75;max-width:560px}
.story>div:nth-child(2){display:none}
.research-card{margin-top:18px;border-top:1px solid var(--line);padding-top:16px}
.research-card span,.audience>span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.research-card strong{display:block;margin-top:9px;font-size:14px;line-height:1.7}
.research-card ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:9px}
.research-card li{position:relative;padding-left:14px;color:var(--muted);font-size:12px;line-height:1.6}
.research-card li:before{content:"";position:absolute;left:0;top:.72em;width:5px;height:1px;background:var(--red)}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.info-grid div{padding:12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.info-grid b{display:block;font-size:24px}
.info-grid span{display:block;margin-top:6px;color:var(--muted);font:800 9px var(--mono);letter-spacing:.12em}
.audience{border:1px solid var(--line);padding:14px;background:rgba(238,231,218,.28)}
.audience div{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.audience b{border:1px solid var(--line);padding:6px 8px;font-size:11px;font-weight:700;background:rgba(255,250,240,.62)}
.site-note{border:1px solid var(--line);padding:14px;margin-top:-4px;background:rgba(238,231,218,.35)}
.site-note b{display:block;font:800 12px var(--mono);letter-spacing:.22em}
.site-note span{display:block;margin-top:6px;color:var(--red);font:800 10px var(--mono);letter-spacing:.16em;text-transform:uppercase}
.site-note p{margin:10px 0 0;color:var(--muted);font-size:12px;line-height:1.65}
.feature{background:var(--dark);color:var(--sheet);border:1px solid var(--dark);padding:16px;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;min-width:0;min-height:0;overflow:hidden}
.feature-head{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start}
.feature h2{margin:6px 0 0;font:800 clamp(28px,2.4vw,42px)/1.05 var(--display);letter-spacing:0;max-width:820px}
.feature p{margin:8px 0 0;color:rgba(255,250,240,.58);font-size:12px;line-height:1.55;max-width:720px}
.count{color:rgba(255,250,240,.45);text-align:right;line-height:1.7}
.stage{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:14px;overflow:hidden}
.main-image{height:100%;aspect-ratio:16/9;max-width:100%;justify-self:center;align-self:center;min-width:0;min-height:0;border:1px solid rgba(255,250,240,.16);display:grid;place-items:center;padding:12px;background:#0a0a09;cursor:zoom-in;position:relative;color:inherit;overflow:hidden}
.main-image img{width:100%;height:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.zoom-hint{position:absolute;right:18px;bottom:18px;background:rgba(18,17,15,.82);border:1px solid rgba(255,250,240,.24);padding:8px 10px;color:rgba(255,250,240,.74);font:800 10px var(--mono);letter-spacing:.12em;opacity:0;transform:translateY(4px);transition:.18s ease}
.main-image:hover .zoom-hint{opacity:1;transform:translateY(0)}
.thumbs{min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:8px;overflow:auto;padding-right:2px}
.thumbs button{border:1px solid rgba(255,250,240,.18);background:#0a0a09;padding:5px;cursor:pointer;min-width:0;position:relative}
.thumbs button.active{border-color:var(--sheet);background:var(--sheet)}
.thumbs img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.thumbs span{display:block;margin-top:5px;color:rgba(255,250,240,.48);font:800 9px var(--mono);letter-spacing:.1em;text-align:left}
.thumbs button.active span{color:var(--dark)}
.caption{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}
.caption b{font-size:18px}
.caption span{display:block;margin-top:5px;color:rgba(255,250,240,.45);font:800 10px var(--mono);letter-spacing:.16em}
.tools{display:flex;align-items:center;gap:8px;min-width:0}
.tools>button{border:1px solid rgba(255,250,240,.22);background:transparent;color:rgba(255,250,240,.76);padding:10px 12px;cursor:pointer;white-space:nowrap;font:800 10px var(--mono);letter-spacing:.12em}
.tools>button:hover{background:var(--sheet);color:var(--dark)}
.tools>button.locked{color:rgba(255,250,240,.38)}
.version{display:flex;gap:8px;overflow:auto}
.version button{color:rgba(255,250,240,.7);border-color:rgba(255,250,240,.22);min-width:112px}
.version button.active,.version button:hover{background:var(--sheet);color:var(--dark);border-color:var(--sheet)}
.placeholder{width:100%;aspect-ratio:16/9;background:var(--sheet);color:var(--ink);display:grid;align-content:space-between;padding:22px}
.placeholder strong{font:700 52px/.85 var(--display);letter-spacing:0}
.placeholder span{color:var(--red);font:800 10px var(--mono);letter-spacing:.2em;text-transform:uppercase}
.thumb-placeholder{padding:10px}
.thumb-placeholder strong{font-size:24px}
.reader{position:fixed;inset:0;background:rgba(10,10,9,.96);z-index:30;display:grid;grid-template-rows:auto minmax(0,1fr) auto;place-items:center;padding:22px;color:var(--sheet)}
.reader-top{width:100%;display:flex;justify-content:space-between;align-items:start;gap:18px}
.reader-top span{display:block;color:rgba(255,250,240,.48);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.reader-top b{display:block;margin-top:6px;font-size:24px}
.reader-top button,.reader-nav{border:1px solid rgba(255,250,240,.24);background:transparent;color:var(--sheet);padding:11px 14px;cursor:pointer;font-weight:800}
.reader img{max-width:min(92vw,1680px);max-height:76vh;object-fit:contain;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.42)}
.reader-nav{position:absolute;top:50%;transform:translateY(-50%)}
.reader-nav.prev{left:22px}
.reader-nav.next{right:22px}
.reader-bottom{color:rgba(255,250,240,.48);font:800 11px var(--mono);letter-spacing:.18em}
@media(max-width:1100px){
  .annual-app{height:auto;min-height:100svh;overflow:visible}
  .top,.spread{grid-template-columns:1fr}
  .spread{overflow:visible}
  .story,.feature,.stage{overflow:visible}
  .shelf{grid-template-columns:repeat(2,minmax(0,1fr))}
  .stage{grid-template-columns:1fr}
  .thumbs{grid-template-columns:repeat(4,minmax(112px,1fr))}
  .thumbs button{min-width:112px}
  .tools{flex-wrap:wrap}
}
@media(max-width:680px){
  .annual-app{padding:14px}
  .story,.feature{padding:16px}
  .shelf{grid-template-columns:1fr}
  .story h1{font-size:64px}
  .feature-head,.caption{grid-template-columns:1fr}
  .meta{text-align:left}
  .tools{display:grid;grid-template-columns:1fr 1fr}
  .tools .version{grid-column:1/-1}
  .reader-nav{position:static;transform:none}
}
`;
