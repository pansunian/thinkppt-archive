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
  framework: { step: string; title: string; text: string }[];
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
      { label: '已提取页面', value: '36' },
      { label: '观察跨度', value: '2024-2025' },
    ],
    studyNotes: ['情绪先行：先定义“慢人”人群，再推导活动表达。', '平台资产化：把内容趋势包装成品牌可买的年度资源。', '版本迭代：从通案到 2.0 再到长线规划，能看到 IP 如何被长期经营。'],
    audience: ['生活方式品牌', '文旅目的地', '城市商业体', '饮品与户外品牌'],
    framework: [
      { step: '01', title: '洞察', text: '把“慢”从生活状态转译成可被认同的人群情绪。' },
      { step: '02', title: 'Big Idea', text: '用「慢人节」命名，让情绪具备节日化传播入口。' },
      { step: '03', title: '策略系统', text: '把人群、内容、场景和目的地串成年度品牌资源。' },
      { step: '04', title: '创意落地', text: '用线下目的地和内容共创，让品牌参与不止停留在露出。' },
    ],
    versions: [
      {
        year: '2024 1.0',
        title: '2024小红书慢人节招商通案',
        summary: '从完整 PDF 自动提取的真实页面：先看封面、叙事开篇、趋势和核心页。',
        dir: `${root}/2024-tongan`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构', '玩法', '资源', '传播', '收束'],
      },
      {
        year: '2024 2.0',
        title: '小红书2024慢人节2.0营销方案',
        summary: '从 2.0 版本 PDF 自动提取的真实页面：用于对比 IP 叙事如何迭代。',
        dir: `${root}/2024-2`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构', '玩法', '资源', '传播', '收束'],
      },
      {
        year: '2025 3.0',
        title: '小红书慢人节2025年长线IP规划',
        summary: '从 2025 长线规划 PDF 自动提取的真实页面：用于观察一个 IP 如何延展成年度资产。',
        dir: `${root}/2025-planning`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
        labels: ['封面', '开篇', '趋势', '洞察', '主题', '场景', '路径', '结构', '玩法', '资源', '传播', '收束'],
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
    framework: [
      { step: '01', title: '洞察', text: '城市漫游正在成为年轻人的低门槛生活方式。' },
      { step: '02', title: '场景', text: '把散步、市集、社区店铺组合成可参与路线。' },
      { step: '03', title: '招商', text: '适合本地生活和线下体验型品牌接入。' },
      { step: '04', title: '待补', text: 'PDF 接入后补充真实页面和版本变化。' },
    ],
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
    framework: [
      { step: '01', title: '节点', text: '开学季天然带有身份变化和社交表达需求。' },
      { step: '02', title: '人群', text: '围绕大学生内容共创和校园场景建立沟通语言。' },
      { step: '03', title: '权益', text: '适合品牌做开学装备、内容任务和校园触点。' },
      { step: '04', title: '待补', text: 'PDF 接入后补充真实页面和版本变化。' },
    ],
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
    framework: [
      { step: '01', title: '日历', text: '用二十四节气建立全年稳定的营销时间表。' },
      { step: '02', title: '内容', text: '节令话题天然适合生活方式表达和达人种草。' },
      { step: '03', title: '品牌', text: '适合新中式、饮食、护肤和文旅品牌持续借势。' },
      { step: '04', title: '待补', text: 'PDF 接入后补充真实页面和版本变化。' },
    ],
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
    framework: [
      { step: '01', title: '节点', text: '春节是平台全年最大规模的用户注意力窗口。' },
      { step: '02', title: '互动', text: '晚会、红包、任务和内容共创共同承接品牌需求。' },
      { step: '03', title: '转化', text: '适合品牌把曝光、互动和交易线索打通。' },
      { step: '04', title: '待补', text: 'PDF 接入后补充真实页面和版本变化。' },
    ],
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
    framework: [
      { step: '01', title: '社区', text: '以 B 站用户文化和 UP 主生态作为内容基础。' },
      { step: '02', title: '节目', text: '把春节节点包装成社区共同参与的内容事件。' },
      { step: '03', title: '合作', text: '品牌需要融入内容语境，而不是简单露出。' },
      { step: '04', title: '待补', text: 'PDF 接入后补充真实页面和版本变化。' },
    ],
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

const thumbFor = (version: PageVersion, pageIndex: number) => {
  if (!version.dir || !version.pages[pageIndex]) return '';
  return `${version.dir}/thumbs/page-${version.pages[pageIndex]}.jpg`;
};

export default function App() {
  const platforms = useMemo(() => ['全部', ...Array.from(new Set(annualData.map(item => item.platform)))], []);
  const [activePlatform, setActivePlatform] = useState('全部');
  const [activeIp, setActiveIp] = useState(0);
  const [activeVersion, setActiveVersion] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [readerOpen, setReaderOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
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
  const shareUrl = typeof window === 'undefined'
    ? ''
    : `${window.location.origin}${window.location.pathname}?ip=${encodeURIComponent(archive.name)}&version=${encodeURIComponent(version.year)}&page=${activePage + 1}`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReaderOpen(false);
      if (event.key === 'Escape') setResearchOpen(false);
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
            className={`ip-card ${index === activeIp ? 'active' : ''} ${item.versions.length ? '' : 'coming'}`}
            onClick={() => selectIp(index)}
          >
            <small>{String(index + 1).padStart(2, '0')}</small>
            <b>{item.name}</b>
            <span>{item.versions.length ? `${item.platform} / ${item.type}` : '即将收录 / PDF 待接入'}</span>
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
            <div className="framework">
              <span>策划路径</span>
              {archive.framework.map(item => (
                <div key={`${item.step}-${item.title}`}>
                  <small>{item.step}</small>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </div>
              ))}
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
            <div className="feature-side">
              <div className="count">
                {String(activePage + 1).padStart(2, '0')} / {String(version.labels.length).padStart(2, '0')}
                <br />
                {version.year}
              </div>
              <div className="version-switch" aria-label="方案版本切换">
                <span>方案版本</span>
                <div className="version">
                  {versions.map((item, index) => (
                    <button
                      key={`${item.year}-${item.title}`}
                      className={index === activeVersion ? 'active' : ''}
                      onClick={() => selectVersion(index)}
                    >
                      <b>{item.year}</b>
                      <small>{item.title.replace(/^小红书|^2024小红书/, '')}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="stage">
            <div className="caption">
              <div>
                <b>{String(activePage + 1).padStart(2, '0')} / {version.labels[activePage]}</b>
                <span>当前页</span>
                <div className="tools">
                  <button onClick={() => activeImage && setReaderOpen(true)}>全屏阅读</button>
                  <button onClick={copyShareLink}>{copyState}</button>
                  <button onClick={() => setResearchOpen(true)}>研究资料</button>
                </div>
              </div>
            </div>

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
                const thumb = thumbFor(version, index);
                return (
                  <button
                    key={`${version.year}-${label}-${index}`}
                    className={index === activePage ? 'active' : ''}
                    onClick={() => setActivePage(index)}
                  >
                    {thumb ? (
                      <img src={thumbFor(version, index)} alt={label} loading="lazy" />
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

      {researchOpen && (
        <section className="research-modal" role="dialog" aria-modal="true" aria-label="研究资料">
          <div className="research-panel">
            <button className="close" onClick={() => setResearchOpen(false)}>关闭</button>
            <div className="eyebrow">Research Dossier</div>
            <h3>{archive.name} 研究资料</h3>
            <p>{archive.thesis}</p>

            <div className="research-sections">
              <article>
                <span>01 / IP 判断</span>
                <strong>{archive.type}</strong>
                <p>{archive.text}</p>
              </article>
              <article>
                <span>02 / 策划路径</span>
                {archive.framework.map(item => (
                  <div key={`research-${item.step}`}>
                    <b>{item.step} {item.title}</b>
                    <p>{item.text}</p>
                  </div>
                ))}
              </article>
              <article>
                <span>03 / 版本演变</span>
                {versions.map(item => (
                  <div key={`research-version-${item.year}`}>
                    <b>{item.year}</b>
                    <p>{item.title}</p>
                  </div>
                ))}
              </article>
              <article>
                <span>04 / 后续可开放</span>
                <p>完整 PDF 下载、逐页策划批注、IP 演变报告、品牌适配清单和可复用方案结构。这里未来可以作为登录或付费后的高价值内容区。</p>
              </article>
            </div>
          </div>
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
.eyebrow,.brand small,.meta,.chapters button,.ip-card small,.version button b,.count{font:800 10px var(--mono);letter-spacing:.22em;text-transform:uppercase}
.brand small{color:var(--muted);display:block}
.brand b{display:block;margin-top:3px;font-size:17px}
.chapters{display:flex;gap:8px;overflow:auto}
.chapters button,.version button{border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;white-space:nowrap}
.chapters button.active,.chapters button:hover{background:var(--ink);color:var(--sheet);border-color:var(--ink)}
.meta{color:var(--muted);text-align:right;line-height:1.6}
.shelf{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;border-bottom:1px solid var(--line);padding-bottom:12px}
.ip-card{min-height:64px;border:1px solid var(--line);background:rgba(255,250,240,.72);padding:10px 12px;cursor:pointer;text-align:left;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;column-gap:10px;row-gap:5px;align-items:center;transition:.18s ease}
.ip-card.active,.ip-card:hover{background:var(--sheet);border-color:var(--red);transform:translateY(-2px)}
.ip-card.coming{opacity:.68}
.ip-card.coming:not(.active){border-style:dashed}
.ip-card small{color:var(--red);align-self:start;padding-top:3px}
.ip-card b{font:800 20px/1.05 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:0}
.ip-card span{grid-column:2;color:var(--muted);font-size:11px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spread{min-height:0;display:grid;grid-template-columns:300px minmax(0,1fr);gap:14px;overflow:hidden}
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
.framework{margin-top:16px;border-top:1px solid var(--line);padding-top:14px;display:grid;gap:8px}
.framework>span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.framework div{display:grid;grid-template-columns:32px 64px 1fr;gap:8px;align-items:start;border-bottom:1px solid rgba(17,16,14,.08);padding:6px 0}
.framework small{color:var(--red);font:800 10px var(--mono);letter-spacing:.08em;padding-top:2px}
.framework b{font-size:12px}
.framework p{margin:0;color:var(--muted);font-size:11px;line-height:1.55}
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
.feature{background:var(--dark);color:var(--sheet);border:1px solid var(--dark);padding:14px 16px 12px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;min-width:0;min-height:0;overflow:hidden}
.feature-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(430px,42vw);gap:20px;align-items:start}
.feature-head>div{min-width:0}
.feature h2{margin:4px 0 0;font:800 clamp(28px,2.4vw,42px)/1.05 var(--display);letter-spacing:0;max-width:820px;overflow-wrap:anywhere;word-break:break-word}
.feature p{margin:8px 0 0;color:rgba(255,250,240,.58);font-size:12px;line-height:1.55;max-width:720px;overflow-wrap:anywhere;word-break:break-word}
.feature-side{display:grid;gap:9px;justify-items:end;min-width:0}
.version-switch{display:grid;grid-template-columns:78px minmax(0,1fr);gap:8px;align-items:stretch;width:100%;max-width:620px}
.version-switch>span{border:1px solid rgba(255,250,240,.22);display:grid;place-items:center;padding:0 10px;color:rgba(255,250,240,.54);font:800 10px var(--mono);letter-spacing:.16em;white-space:nowrap}
.count{color:rgba(255,250,240,.45);text-align:right;line-height:1.7}
.stage{min-height:0;display:grid;grid-template-columns:118px minmax(0,1fr) 330px;gap:12px;overflow:hidden}
.main-image{height:100%;width:auto;aspect-ratio:16/9;max-width:100%;justify-self:center;align-self:center;min-width:0;min-height:0;border:1px solid rgba(255,250,240,.16);display:grid;place-items:center;padding:10px;background:#0a0a09;cursor:zoom-in;position:relative;color:inherit;overflow:hidden}
.main-image img{width:100%;height:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.zoom-hint{position:absolute;right:18px;bottom:18px;background:rgba(18,17,15,.82);border:1px solid rgba(255,250,240,.24);padding:8px 10px;color:rgba(255,250,240,.74);font:800 10px var(--mono);letter-spacing:.12em;opacity:0;transform:translateY(4px);transition:.18s ease}
.main-image:hover .zoom-hint{opacity:1;transform:translateY(0)}
.thumbs{min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start;gap:7px;overflow:hidden;padding-right:0}
.thumbs button{border:1px solid rgba(255,250,240,.18);background:#0a0a09;padding:4px;cursor:pointer;min-width:0;position:relative}
.thumbs button.active{border-color:var(--sheet);background:var(--sheet)}
.thumbs img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#fff}
.thumbs span{display:block;margin-top:4px;color:rgba(255,250,240,.48);font:800 8px var(--mono);letter-spacing:.08em;text-align:left}
.thumbs button.active span{color:var(--dark)}
.caption{display:flex;align-items:end;min-width:0;min-height:0}
.caption>div{display:grid;gap:12px;align-content:end;width:100%;min-width:0}
.caption b{font-size:18px}
.caption span{display:block;margin-top:5px;color:rgba(255,250,240,.45);font:800 10px var(--mono);letter-spacing:.16em}
.tools{display:grid;gap:8px;min-width:0}
.tools>button{border:1px solid rgba(255,250,240,.22);background:transparent;color:rgba(255,250,240,.76);padding:11px 10px;cursor:pointer;white-space:nowrap;font:800 10px var(--mono);letter-spacing:.12em;text-align:center}
.tools>button:hover{background:var(--sheet);color:var(--dark)}
.version{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;overflow:visible}
.version button{color:rgba(255,250,240,.7);border-color:rgba(255,250,240,.22);min-width:0;text-align:left;padding:8px 10px;background:rgba(255,250,240,.03)}
.version button b,.version button small{display:block}
.version button small{margin-top:6px;color:rgba(255,250,240,.42);font-size:11px;line-height:1.35;white-space:normal}
.version button.active,.version button:hover{background:var(--sheet);color:var(--dark);border-color:var(--sheet)}
.version button.active small,.version button:hover small{color:rgba(18,17,15,.55)}
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
.research-modal{position:fixed;inset:0;z-index:35;background:rgba(10,10,9,.78);display:grid;place-items:center;padding:24px;color:var(--ink)}
.research-panel{width:min(920px,96vw);max-height:86vh;overflow:auto;background:var(--sheet);border:1px solid var(--line);padding:28px;position:relative;box-shadow:0 30px 90px rgba(0,0,0,.38)}
.research-panel .close{position:absolute;right:18px;top:18px;border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;font-weight:800}
.research-panel h3{margin:10px 0 0;font:800 44px/1.05 var(--display);letter-spacing:0}
.research-panel>p{max-width:720px;margin:12px 0 0;color:var(--muted);line-height:1.75}
.research-sections{margin-top:24px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line)}
.research-sections article{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px;min-height:190px}
.research-sections article>span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px}
.research-sections strong{font-size:19px}
.research-sections p{color:var(--muted);font-size:13px;line-height:1.65}
.research-sections div{border-top:1px solid rgba(17,16,14,.08);padding-top:10px;margin-top:10px}
.research-sections b{font-size:13px}
@media(max-width:1100px){
  .annual-app{height:auto;min-height:100svh;overflow:visible}
  .top,.spread{grid-template-columns:1fr}
  .spread{overflow:visible}
  .story,.feature,.stage{overflow:visible}
  .feature-head{grid-template-columns:1fr}
  .feature-side{justify-items:start}
  .shelf{grid-template-columns:repeat(2,minmax(0,1fr))}
  .stage{grid-template-columns:1fr}
  .caption{align-items:start}
  .thumbs{grid-template-columns:repeat(4,minmax(112px,1fr))}
  .thumbs{overflow:auto}
  .thumbs button{min-width:112px}
  .tools{flex-wrap:wrap}
}
@media(max-width:680px){
  .annual-app{padding:14px}
  .story,.feature{padding:16px}
  .shelf{display:flex;overflow:auto;padding-bottom:10px}
  .ip-card{min-width:210px}
  .feature{order:1}
  .story{order:2}
  .story h1{font-size:64px}
  .feature h2{font-size:28px;line-height:1.12;max-width:100%}
  .feature p{max-width:100%}
  .feature-head,.version-switch{grid-template-columns:1fr}
  .version{grid-template-columns:1fr}
  .caption>div{display:grid;grid-template-columns:1fr;gap:12px}
  .meta{text-align:left}
  .stage{gap:12px}
  .main-image{width:100%;height:auto}
  .thumbs{display:flex;overflow:auto}
  .thumbs button{min-width:130px}
  .tools{display:grid;grid-template-columns:1fr 1fr}
  .research-sections{grid-template-columns:1fr}
  .reader-nav{position:static;transform:none}
}
`;
