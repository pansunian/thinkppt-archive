import React, { useMemo, useState } from 'react';

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
  versions: PageVersion[];
};

const root = '/scheme-pages/xiaohongshu/manrenjie';

const annualData: IpAnnual[] = [
  {
    platform: '小红书',
    name: '慢人节',
    type: '生活方式情绪 IP',
    text: '年鉴页面的重点不是拆招商权益，而是让用户像翻一本数字方案集一样，快速浏览同一个 IP 在不同年份、不同版本里的 PPT 页面。',
    versions: [
      {
        year: '2024',
        title: '2024小红书慢人节招商通案',
        summary: '浏览这份 PDF 的代表页面：封面、情绪、事件、路线等关键页。',
        dir: `${root}/2024-tongan`,
        pages: ['001', '003', '012', '033', '001', '003', '012', '033'],
        labels: ['封面', '慢人心态', '平台级事件', '慢人路线', '封面复看', '情绪复看', '事件复看', '路线复看'],
      },
      {
        year: '2024 2.0',
        title: '小红书2024慢人节2.0营销方案',
        summary: '浏览 2.0 版本的代表页面：人群趋势、核心洞察和长线运营等页面。',
        dir: `${root}/2024-2`,
        pages: ['001', '005', '008', '023', '001', '005', '008', '023'],
        labels: ['封面', '慢人群趋势', '核心洞察', '长线运营', '封面复看', '趋势复看', '洞察复看', '运营复看'],
      },
      {
        year: '2025',
        title: '小红书慢人节2025年长线IP规划',
        summary: '浏览 2025 长线规划版本的代表页面：年度规划、内容阵地和用户旅程等页面。',
        dir: `${root}/2025-planning`,
        pages: ['001', '003', '021', '028', '001', '003', '021', '028'],
        labels: ['封面', '年度规划', '内容阵地', '用户旅程', '封面复看', '规划复看', '阵地复看', '旅程复看'],
      },
    ],
  },
  {
    platform: '小红书',
    name: '遛遛生活',
    type: '城市市集 IP',
    text: '城市散步、市集和线下体验如何变成平台招商项目。后续上传 PDF 后，这里会自动展开完整页面。',
    versions: [],
  },
  {
    platform: '小红书',
    name: '闪光青春派',
    type: '校园 IP',
    text: '校园开学季如何被包装成年度营销资产。后续上传 PDF 后，这里会自动展开完整页面。',
    versions: [],
  },
  {
    platform: '抖音',
    name: '节气 IP',
    type: '传统文化节点 IP',
    text: '用二十四节气搭建全年内容日历和品牌种草资产。后续上传 PDF 后，这里会自动展开完整页面。',
    versions: [],
  },
  {
    platform: '快手',
    name: '春节 IP',
    type: '春节节点 IP',
    text: '春节流量如何变成晚会、互动和品牌资源包。后续上传 PDF 后，这里会自动展开完整页面。',
    versions: [],
  },
  {
    platform: 'BILIBILI',
    name: '拜年纪',
    type: '内容 IP',
    text: '社区内容、UP 主生态与春节节点合作方式。后续上传 PDF 后，这里会自动展开完整页面。',
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
  return `${version.dir}/page-${version.pages[pageIndex]}.webp`;
};

export default function App() {
  const platforms = useMemo(() => ['全部', ...Array.from(new Set(annualData.map(item => item.platform)))], []);
  const [activePlatform, setActivePlatform] = useState('全部');
  const [activeIp, setActiveIp] = useState(0);
  const [activeVersion, setActiveVersion] = useState(0);
  const [activePage, setActivePage] = useState(0);

  const filtered = annualData.filter(item => activePlatform === '全部' || item.platform === activePlatform);
  const archive = filtered[activeIp] || filtered[0] || annualData[0];
  const versions = archive.versions.length ? archive.versions : [fallbackVersion(archive)];
  const version = versions[activeVersion] || versions[0];
  const activeImage = imageFor(version, activePage);
  const totalPages = versions.reduce((sum, item) => sum + item.labels.length, 0);

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
          </div>
          <div />
          <div className="info-grid">
            <div><b>{platforms.length - 1}</b><span>PLATFORM</span></div>
            <div><b>{versions.length}</b><span>VERSIONS</span></div>
            <div><b>{totalPages}</b><span>PAGES</span></div>
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
            <div className="main-image">
              {activeImage ? (
                <img src={activeImage} alt={version.labels[activePage]} />
              ) : (
                <div className="placeholder">
                  <span>{archive.platform}</span>
                  <strong>{archive.name}</strong>
                  <span>{version.labels[activePage]} / PDF 待接入</span>
                </div>
              )}
            </div>

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
        </section>
      </section>
    </main>
  );
}

const styles = `
:root{
  --paper:#eee7da;
  --sheet:#fffaf0;
  --ink:#11100e;
  --muted:#746d63;
  --line:rgba(17,16,14,.14);
  --red:#9d382e;
  --dark:#12110f;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
  --sans:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif;
  --serif:Georgia,"Songti SC",serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);letter-spacing:0}
button{font:inherit;color:inherit}
.annual-app{min-height:100vh;padding:22px;display:grid;grid-template-rows:auto auto 1fr;gap:16px;background:var(--paper)}
.top{display:grid;grid-template-columns:260px 1fr auto;gap:24px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:16px}
.brand{display:flex;align-items:center;gap:13px}
.mark{width:42px;height:42px;background:var(--ink);color:var(--sheet);display:grid;place-items:center;font:700 28px var(--serif)}
.eyebrow,.brand small,.meta,.chapters button,.ip-card small,.version button,.count{font:800 10px var(--mono);letter-spacing:.22em;text-transform:uppercase}
.brand small{color:var(--muted);display:block}
.brand b{display:block;margin-top:3px;font-size:17px}
.chapters{display:flex;gap:8px;overflow:auto}
.chapters button,.version button{border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;white-space:nowrap}
.chapters button.active,.chapters button:hover{background:var(--ink);color:var(--sheet);border-color:var(--ink)}
.meta{color:var(--muted);text-align:right;line-height:1.6}
.shelf{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;border-bottom:1px solid var(--line);padding-bottom:14px}
.ip-card{border:1px solid var(--line);background:rgba(255,250,240,.72);padding:12px;cursor:pointer;text-align:left;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;transition:.18s ease}
.ip-card.active,.ip-card:hover{background:var(--sheet);border-color:var(--red);transform:translateY(-2px)}
.ip-card small{color:var(--red)}
.ip-card b{font:700 24px/.92 var(--serif);letter-spacing:-.05em}
.ip-card span{color:var(--muted);font-size:12px;line-height:1.5}
.spread{min-height:0;display:grid;grid-template-columns:.9fr 1.7fr;gap:18px}
.story{background:var(--sheet);border:1px solid var(--line);padding:28px;display:grid;grid-template-rows:auto 1fr auto;gap:24px;min-width:0}
.story .eyebrow{color:var(--red)}
.story h1{margin:12px 0 0;font:700 clamp(58px,9vw,138px)/.78 var(--serif);letter-spacing:-.08em}
.story p{margin:20px 0 0;color:var(--muted);font-size:15px;line-height:1.9;max-width:560px}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.info-grid div{padding:14px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.info-grid b{display:block;font-size:28px}
.info-grid span{display:block;margin-top:8px;color:var(--muted);font:800 10px var(--mono);letter-spacing:.16em}
.feature{background:var(--dark);color:var(--sheet);border:1px solid var(--dark);padding:18px;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;min-width:0}
.feature-head{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start}
.feature h2{margin:7px 0 0;font:700 clamp(38px,4.5vw,76px)/.88 var(--serif);letter-spacing:-.07em}
.feature p{margin:10px 0 0;color:rgba(255,250,240,.62);font-size:13px;line-height:1.75;max-width:720px}
.count{color:rgba(255,250,240,.45);text-align:right;line-height:1.7}
.stage{min-height:0;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:14px}
.main-image{min-width:0;border:1px solid rgba(255,250,240,.16);display:grid;place-items:center;padding:16px;background:#0a0a09}
.main-image img{width:100%;max-height:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.thumbs{display:grid;grid-template-columns:repeat(8,minmax(112px,1fr));gap:8px;overflow:auto;padding-bottom:2px}
.thumbs button{border:1px solid rgba(255,250,240,.18);background:#0a0a09;padding:5px;cursor:pointer;min-width:112px;position:relative}
.thumbs button.active{border-color:var(--sheet);background:var(--sheet)}
.thumbs img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.thumbs span{display:block;margin-top:5px;color:rgba(255,250,240,.48);font:800 9px var(--mono);letter-spacing:.1em;text-align:left}
.thumbs button.active span{color:var(--dark)}
.caption{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}
.caption b{font-size:20px}
.caption span{display:block;margin-top:5px;color:rgba(255,250,240,.45);font:800 10px var(--mono);letter-spacing:.16em}
.version{display:flex;gap:8px;overflow:auto}
.version button{color:rgba(255,250,240,.7);border-color:rgba(255,250,240,.22);min-width:112px}
.version button.active,.version button:hover{background:var(--sheet);color:var(--dark);border-color:var(--sheet)}
.placeholder{width:100%;aspect-ratio:16/9;background:var(--sheet);color:var(--ink);display:grid;align-content:space-between;padding:22px}
.placeholder strong{font:700 52px/.85 var(--serif);letter-spacing:-.07em}
.placeholder span{color:var(--red);font:800 10px var(--mono);letter-spacing:.2em;text-transform:uppercase}
.thumb-placeholder{padding:10px}
.thumb-placeholder strong{font-size:24px}
@media(max-width:1100px){
  .top,.spread{grid-template-columns:1fr}
  .shelf{grid-template-columns:repeat(2,1fr)}
  .thumbs{grid-template-columns:repeat(4,minmax(112px,1fr))}
}
@media(max-width:680px){
  .annual-app{padding:14px}
  .story,.feature{padding:16px}
  .shelf{grid-template-columns:1fr}
  .story h1{font-size:64px}
  .feature-head,.caption{grid-template-columns:1fr}
  .meta{text-align:left}
}
`;
