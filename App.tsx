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
const snowRoot = '/scheme-pages/xiaohongshu/xuerenjie';
const liuliuRoot = '/scheme-pages/xiaohongshu/liuliu';
const shanguangRoot = '/scheme-pages/xiaohongshu/shanguang';
const cnyRoot = '/scheme-pages/xiaohongshu/cny';

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
        labels: ['封面', '倍速时代', '慢人心态', '生活状态', '场景扩大', '场景趋势', '货品治愈', '货品趋势', '温暖提醒', '提醒内容', '重回慢生活', '事件机制'],
      },
      {
        year: '2024 2.0',
        title: '小红书2024慢人节2.0营销方案',
        summary: '从 2.0 版本 PDF 自动提取的真实页面：用于对比 IP 叙事如何迭代。',
        dir: `${root}/2024-2`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
        labels: ['封面', '初次见面', '慢人路线', '外摆饭局', '8大慢人群', '趋势场景A', '趋势场景B', 'H2H趋势', '身心灵范式', '慢人游', '城市趋势榜', '慢人路线'],
      },
      {
        year: '2025 3.0',
        title: '小红书慢人节2025年长线IP规划',
        summary: '从 2025 长线规划 PDF 自动提取的真实页面：用于观察一个 IP 如何延展成年度资产。',
        dir: `${root}/2025-planning`,
        pages: ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'],
        labels: ['封面', '项目数据', '活动总览', 'Slow Rock', '趋势数据', '音乐现场', '看山看海', '情绪出口', '山海音乐会', '五行场景', '海中之音', '落洞音乐会'],
      },
    ],
  },
  {
    platform: '小红书',
    name: '雪人节',
    type: '冰雪生活方式 IP',
    text: '把滑雪、玩雪和冬季情绪包装成可招商、可打卡、可持续运营的冬季平台 IP。',
    thesis: '它的价值在于把“冰雪热”从运动项目转译成生活方式事件：用人群洞察承接冬季情绪，用雪场/城市/内容任务组织品牌参与，并逐年升级成更完整的冬季营销资产。',
    metrics: [
      { label: '版本谱系', value: '2' },
      { label: '精选页面', value: '24' },
      { label: '观察跨度', value: '2023-2024' },
    ],
    studyNotes: ['从冰雪热到人群热：先证明冬季生活方式正在升温，再定义可参与人群。', '从雪场到内容场：把线下目的地、社区内容和品牌任务串成闭环。', '从活动到年度资产：2024 版本已经出现“遇雪/滑雪/玩雪”的阶段化运营结构。'],
    audience: ['户外运动品牌', '冬季服饰', '文旅雪场', '饮品与出行品牌'],
    framework: [
      { step: '01', title: '洞察', text: '用冰雪热和年轻人冬季兴趣证明 IP 的情绪与消费土壤。' },
      { step: '02', title: '主题', text: '用“雪人节”把滑雪、玩雪和冬日社交收束成节日化入口。' },
      { step: '03', title: '结构', text: '从社区共创、赛场承包、城市/雪场路线构建参与路径。' },
      { step: '04', title: '落地', text: '用雪人路线、滑雪团、玩雪赛和站内传播放大品牌参与感。' },
    ],
    versions: [
      {
        year: '2023',
        title: '2023小红书雪人节招商方案',
        summary: '精选封面、人群洞察、社区共创、雪人路线、创意玩法和参与路径等关键页。',
        dir: `${snowRoot}/2023`,
        pages: ['001', '002', '003', '005', '006', '009', '010', '011', '015', '018', '027', '028'],
        labels: ['封面', '冰雪热趋势', '爱雪人群', '年度大事件', '社区共创', '雪人路线', '雪圈大事件', '雪圈表情集', '雪球之路', '滑雪团', '参与路径', '时间链路'],
      },
      {
        year: '2024',
        title: '2024小红书雪人节招商方案',
        summary: '精选成果回顾、趋势洞察、三阶段玩法、关键创意、主会场流程和用户路径等关键页。',
        dir: `${snowRoot}/2024`,
        pages: ['001', '002', '004', '010', '011', '015', '019', '021', '022', '024', '030', '036'],
        labels: ['封面', '成果回顾', '趋势洞察', '方案概览', '遇雪阶段', '滑雪阶段', '玩雪阶段', '限玩雪体验', '玩雪PK赛', '市集摊位', '传播节奏', '参与路径'],
      },
    ],
  },
  {
    platform: '小红书',
    name: '遛遛生活',
    type: '城市市集 IP',
    text: '把城市散步、市集、社区店铺和节日出游包装成可招商、可打卡、可长期运营的城市生活方式 IP。',
    thesis: '它的价值在于把“出门逛逛”变成平台级线下场景资产：用城市路线组织用户行动，用市集摊位和店铺共创承接品牌体验，再用站内内容把线下热闹变成可传播的生活方式符号。',
    metrics: [
      { label: '版本谱系', value: '2' },
      { label: '精选页面', value: '24' },
      { label: '观察跨度', value: '2024-2025' },
    ],
    studyNotes: ['从“逛”到“可招商”：把散步、市集、打卡和消费任务组织成品牌可参与的路线。', '从社区到平台事件：线下摊位、城市店铺和站内传播共同构成 IP 的商业闭环。', '从日常到节日化：上海新年季版本把“遛遛生活”延展到春节前后的情绪节点。'],
    audience: ['城市商业', '本地生活', '咖啡酒饮', '户外休闲', '文旅目的地'],
    framework: [
      { step: '01', title: '洞察', text: '年轻人需要低门槛、轻计划、可分享的城市出游理由。' },
      { step: '02', title: '场景', text: '把市集、社区店、街区路线和节日节点组合成可参与的城市动线。' },
      { step: '03', title: '品牌', text: '用摊位、产品体验、集章任务和内容挑战承接品牌参与。' },
      { step: '04', title: '传播', text: '用站内话题、达人探店和路线内容，把线下人流沉淀成可复用内容资产。' },
    ],
    versions: [
      {
        year: '2024 广州',
        title: '小红书遛遛生活·广州市集合作方案',
        summary: '精选封面、平台事件、上海站案例、活动场景、市集平面、互动玩法、品牌招商和时间线等关键页。',
        dir: `${liuliuRoot}/guangzhou`,
        pages: ['001', '002', '003', '004', '005', '009', '011', '012', '015', '020', '021', '045'],
        labels: ['封面', '平台事件', '上海站案例', '场景回顾', '品牌参与', '市集现场', '遛之大集', '场地平面', '互动玩法', '招商入口', '产品体验', '时间线'],
      },
      {
        year: '2025 新年季',
        title: '遛遛生活上海新年季招商方案',
        summary: '精选封面、IP 资产回顾、新年趋势、启动员、到场理由、品牌提案、吃喝玩乐主线和 Roadmap 等关键页。',
        dir: `${liuliuRoot}/shanghai-new-year`,
        pages: ['001', '002', '004', '006', '007', '008', '010', '011', '012', '013', '021', '043'],
        labels: ['封面', '资产回顾', '新年趋势', '启动员', '到场理由', '品牌提案', '吃喝玩乐', '深度定制', '主题事件', '线下场域', '新年主题', 'Roadmap'],
      },
    ],
  },
  {
    platform: '小红书',
    name: '闪光青春派',
    type: '校园 IP',
    text: '把 3 月开学季从普通节点包装成校园人群、青春情绪和品牌共创的年度营销资产。',
    thesis: '它的价值在于把“开学”从时间节点升级为年轻人情绪入口：用青春叙事建立人群共鸣，用校园大事件和线下装置承接品牌体验，再用站内内容扩散形成可复用的校园 IP 资产。',
    metrics: [
      { label: '版本谱系', value: '2' },
      { label: '精选页面', value: '24' },
      { label: '观察跨度', value: '2024-2025' },
    ],
    studyNotes: ['节点命名：用“闪光青春派”把开学季转译成更有情绪感的青春事件。', '人群组织：围绕大学生、校园社交、返校仪式感和新生活方式建立沟通语言。', '版本迭代：2025 版从“开学跟风大会”升级到“好运花路”，更强调阶段任务与内容扩散。'],
    audience: ['3C 数码', '美妆个护', '饮料零食', '校园服务', '潮流服饰'],
    framework: [
      { step: '01', title: '洞察', text: '开学季承载新身份、新关系和新生活状态，是年轻人表达自我的窗口。' },
      { step: '02', title: '主题', text: '用“闪光”“青春”“好运花路”等表达，把校园节点变成可传播的情绪符号。' },
      { step: '03', title: '场景', text: '通过校园大事件、线下装置、互动周边和品牌任务组织参与路径。' },
      { step: '04', title: '扩散', text: '用达人内容、站内话题、用户旅程和传播节奏把节点热度放大。' },
    ],
    versions: [
      {
        year: '2024 开学季',
        title: '2024小红书《闪光青春派》3月开学季主题招商',
        summary: '精选封面、人群洞察、开学跟风大会、校园事件、品牌互动、六大亮点和传播节奏等关键页。',
        dir: `${shanguangRoot}/2024`,
        pages: ['001', '008', '009', '010', '012', '013', '018', '019', '023', '027', '031', '032'],
        labels: ['封面', '青春洞察', '开学大会', '主题视觉', '人群数据', '场景概览', '联动玩法', '资源组合', '品牌权益', '现场活动', '六大亮点', '时间线'],
      },
      {
        year: '2025 开学季',
        title: '【2025小红书开学季】闪光开学季招商通案',
        summary: '精选封面、开学邀约、春天花会开、好运花路、资源矩阵、达人内容、线下装置和用户路径等关键页。',
        dir: `${shanguangRoot}/2025`,
        pages: ['001', '005', '006', '007', '009', '010', '013', '014', '019', '025', '027', '030'],
        labels: ['封面', '开学邀约', '年度主题', '数据资产', '三阶段', '资源矩阵', '好运花路', '达人种草', '线下装置', '传播扩散', '合作路径', '用户路径'],
      },
    ],
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
    platform: '小红书',
    name: '小红书 CNY',
    type: '春节节点 IP',
    text: '把春节年味、返乡情绪、内容共创和线下场景包装成平台级年度营销资产。',
    thesis: '它的价值在于把春节从单次节点投放升级为可连续经营的 CNY IP：先证明年轻人仍然需要年味，再用内容、明星、线下场景、城市联动和品牌资源包把“过年就来小红书”做成年轻人的春节入口。',
    metrics: [
      { label: '版本谱系', value: '4' },
      { label: '精选页面', value: '48' },
      { label: '观察跨度', value: '2024-2025' },
    ],
    studyNotes: ['从“春节流量”到“年味资产”：先定义年轻人为什么还需要过年，再找到平台可占据的情绪入口。', '从线上内容到线下场景：CNY 方案明显在用城市、商场、年货市集和春晚互动把内容 IP 实体化。', '从主题到产品化：2025 版本已经出现更清晰的资源包、传播节奏和品牌共创方式。'],
    audience: ['食品饮料', '电商与零售', '文旅城市', '美妆个护', '出行与本地生活'],
    framework: [
      { step: '01', title: '洞察', text: '春节不是过时节点，而是年轻人重新寻找年味、关系和生活仪式的高密度时刻。' },
      { step: '02', title: '主题', text: '用“过年就来小红书”把年货、年味、年俗和出行收束成平台入口。' },
      { step: '03', title: '场景', text: '用春晚、年货市集、城市路线、线下大事件和 UGC 内容把节点变成可参与场景。' },
      { step: '04', title: '资源', text: '把站内流量、达人明星、品牌共创和线下曝光组合成品牌可购买的春节资源包。' },
    ],
    versions: [
      {
        year: '2024 龙年',
        title: '2024小红书CNY【龙年龙咚锵】招商方案',
        summary: '精选封面、年味复兴洞察、项目节奏、寻找龙咚锵、城市寻访、产品互动和资源页。',
        dir: `${cnyRoot}/2024-dragon`,
        pages: ['001', '003', '005', '006', '007', '009', '010', '012', '013', '016', '018', '024'],
        labels: ['封面', '年味洞察', '节点判断', '复兴计划', '路线图', 'IP 定义', '产品玩法', '全站寻找', '城市寻访', '记忆扭蛋机', '互动产品', '引流资源'],
      },
      {
        year: '2024 IP',
        title: '2024过年就来小红书CNY招商方案',
        summary: '精选用户规模、过年决策、大家的新年、春晚联动、资源曝光和互动玩法等关键页。',
        dir: `${cnyRoot}/2024-ip`,
        pages: ['001', '002', '003', '006', '007', '008', '010', '016', '021', '028', '031', '041'],
        labels: ['封面', '用户规模', '决策答案', '共创新年', 'IP 结构', '春晚节奏', '流量高点', '作战线', '曝光注入', '内容共创', '互动玩法', '资源曝光'],
      },
      {
        year: '2025 IP',
        title: '2025 CNY【过年就来小红书】IP招商方案',
        summary: '精选回顾、洞察、升级主题、内容框架、时间战线、品牌共创模型和项目节奏。',
        dir: `${cnyRoot}/2025-ip`,
        pages: ['001', '003', '004', '006', '010', '013', '014', '016', '017', '028', '036', '047'],
        labels: ['封面', '过年方式', '洞察', '参考答案', '威力', '主题页', '内容框架', '作战线', '开场', '共创模型', '线下联动', '项目节奏'],
      },
      {
        year: '2025 大集',
        title: '2025小红书CNY【新年小红大集】招商方案',
        summary: '精选新年小红大集、年夜饭洞察、红运主题、项目目标、三阶段路径、线下市集和传播路线。',
        dir: `${cnyRoot}/2025-market`,
        pages: ['001', '003', '004', '006', '007', '008', '010', '013', '014', '022', '024', '031'],
        labels: ['封面', '年轻人过年', '年夜饭洞察', '红运主张', '主题页', '项目目标', '大集场景', '阶段路径', '清单', '线下市集', '红运玩法', '路线图'],
      },
    ],
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
  const [copyState, setCopyState] = useState('复制当前页链接');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = window.localStorage.getItem('thinkppt-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setThemeMode(savedTheme);

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
  const thumbIndexes = version.labels.map((_, index) => index).slice(0, 10);
  if (activePage >= 10 && !thumbIndexes.includes(activePage)) {
    thumbIndexes[thumbIndexes.length - 1] = activePage;
  }
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
      window.setTimeout(() => setCopyState('复制当前页链接'), 1600);
    } catch {
      setCopyState('复制失败');
      window.setTimeout(() => setCopyState('复制当前页链接'), 1600);
    }
  };

  const toggleTheme = () => {
    setThemeMode(mode => {
      const nextMode = mode === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('thinkppt-theme', nextMode);
      return nextMode;
    });
  };

  return (
    <main className={`annual-app ${themeMode === 'dark' ? 'theme-dark' : ''}`}>
      <style>{styles}</style>

      <header className="top">
        <a className="brand" href="/" aria-label="ThinkPPT 首页">
          <div className="mark">T</div>
          <div>
            <b>ThinkPPT</b>
            <small>深刻PPT</small>
          </div>
        </a>
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
        <div className="top-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换页面风格"
          >
            <span className={themeMode === 'light' ? 'active' : ''}>浅</span>
            <span className={themeMode === 'dark' ? 'active' : ''}>深</span>
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="rail">
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
        </aside>

        <section className="main-stack">
          <section className="story">
            <div className="story-intro">
              <div className="eyebrow">Annual Feature</div>
              <h1>{archive.name}</h1>
              <p>{archive.text}</p>
            </div>
            <div className="story-metrics" aria-label="IP 版本谱系">
              {archive.metrics.map(metric => (
                <div key={metric.label}>
                  <b>{metric.value}</b>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </section>

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
                    <small>{item.title.replace(/^\d{4}小红书|^小红书/, '')}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="stage">
              <div className="image-shell">
                <button
                  className="page-arrow page-arrow-prev"
                  onClick={() => setActivePage(page => Math.max(page - 1, 0))}
                  aria-label="上一页"
                >
                  ←
                </button>
                <button
                  className="page-arrow page-arrow-next"
                  onClick={() => setActivePage(page => Math.min(page + 1, version.labels.length - 1))}
                  aria-label="下一页"
                >
                  →
                </button>

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
              </div>

              <div className="caption">
                <b>{String(activePage + 1).padStart(2, '0')} / {version.labels[activePage]}</b>
                <span>当前页</span>
                <div className="tools">
                  <button onClick={() => activeImage && setReaderOpen(true)}>全屏阅读</button>
                  <button onClick={copyShareLink}>{copyState}</button>
                  <button onClick={() => setResearchOpen(true)}>研究资料</button>
                </div>
              </div>

              <div className="thumbs" aria-label="PDF 页面缩略图">
                {thumbIndexes.map((index) => {
                  const label = version.labels[index];
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

          <section className="detail-section">
            <div className="research-card">
              <span>策划人读法</span>
              <strong>{archive.thesis}</strong>
              <ul>
                {archive.studyNotes.map(note => <li key={note}>{note}</li>)}
              </ul>
            </div>
            <div className="framework">
              <span>策划路径</span>
              <div className="framework-grid">
                {archive.framework.map(item => (
                  <div key={`${item.step}-${item.title}`}>
                    <small>{item.step}</small>
                    <b>{item.title}</b>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <footer className="site-note">
            <b>ThinkPPT</b>
            <span>深刻PPT</span>
            <p>面向策划人和品牌市场部的互联网平台 IP 方案年鉴，持续收藏、整理和策展高质量营销方案。</p>
            <small><a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">陕ICP备2026004104号-2</a></small>
          </footer>
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
          <div className="reader-bottom">
            <button onClick={() => setActivePage(page => Math.max(page - 1, 0))}>上一页</button>
            <span>{String(activePage + 1).padStart(2, '0')} / {String(version.labels.length).padStart(2, '0')}</span>
            <button onClick={() => setActivePage(page => Math.min(page + 1, version.labels.length - 1))}>下一页</button>
          </div>
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
html,body,#root{min-height:100%}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--text);letter-spacing:0;overflow-y:auto}
button{font:inherit;color:inherit}
.annual-app{min-height:100svh;padding:14px;background:var(--paper);color:var(--ink);overflow:visible;display:grid;grid-template-rows:auto auto;gap:10px}
.annual-app.theme-dark{--paper:#0f0e0c;--sheet:#171613;--ink:#fffaf0;--muted:#a9a19a;--line:rgba(255,250,240,.15);--red:#d26352}
.theme-dark .mark{background:var(--sheet);color:var(--ink);border-color:var(--line)}
.theme-dark .ip-card,.theme-dark .story-metrics,.theme-dark .framework-grid div,.theme-dark .version button,.theme-dark .thumbs button,.theme-dark .site-note{background:rgba(255,250,240,.035)}
.theme-dark .ip-card.active,.theme-dark .ip-card:hover{background:rgba(255,250,240,.075)}
.theme-dark .image-shell,.theme-dark .main-image,.theme-dark .main-image img{background:#0a0a09}
.theme-dark .page-arrow{border-color:rgba(255,250,240,.2);background:rgba(18,17,15,.72);color:var(--ink)}
.theme-dark .page-arrow:hover{background:var(--ink);color:var(--sheet)}
.theme-dark .zoom-hint{background:rgba(18,17,15,.82);border-color:rgba(255,250,240,.2);color:rgba(255,250,240,.78)}
.theme-dark .theme-toggle{background:rgba(255,250,240,.05)}
.theme-dark .theme-toggle span.active{background:var(--ink);color:var(--paper)}
.theme-dark .thumbs img{background:#0a0a09}
.brand{display:flex;align-items:center;gap:13px;color:inherit;text-decoration:none}
.mark{width:42px;height:42px;background:var(--ink);color:var(--sheet);display:grid;place-items:center;font:700 28px/.9 var(--display);border:1px solid var(--ink)}
.eyebrow,.brand small,.chapters button,.ip-card small,.version button b,.count{font:800 10px var(--mono);letter-spacing:.22em;text-transform:uppercase}
.brand small{color:var(--muted);display:block;margin-top:4px;font:700 12px/1 var(--text);letter-spacing:.1em;text-transform:none}
.brand b{display:block;font:800 23px/.95 var(--text);letter-spacing:0}
.top{min-width:0;display:grid;grid-template-columns:236px minmax(0,1fr) auto;gap:18px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:10px}
.chapters{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;min-width:0;padding:2px 0;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.chapters button,.version button{border:1px solid var(--line);background:transparent;padding:10px 14px;cursor:pointer;white-space:nowrap}
.chapters button.active,.chapters button:hover{background:var(--ink);color:var(--sheet);border-color:var(--ink)}
.top-actions{display:flex;align-items:center;justify-content:flex-end;min-width:0}
.theme-toggle{border:1px solid var(--line);background:transparent;color:var(--muted);padding:2px;cursor:pointer;font:800 10px var(--mono);letter-spacing:.16em;white-space:nowrap;display:flex;gap:2px;align-items:center}
.theme-toggle span{display:grid;place-items:center;min-width:30px;height:26px;padding:0 8px}
.theme-toggle span.active{background:var(--ink);color:var(--sheet)}
.theme-toggle:hover{border-color:var(--ink)}
.workspace{min-height:0;display:grid;grid-template-columns:230px minmax(0,1fr);gap:12px;overflow:visible;align-items:start}
.rail{min-width:0;min-height:0;display:grid;grid-template-rows:minmax(0,1fr);gap:12px;position:sticky;top:14px;max-height:calc(100svh - 28px)}
.shelf{display:grid;grid-auto-rows:min-content;gap:8px;overflow:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.ip-card{width:100%;min-height:64px;border:1px solid var(--line);background:rgba(255,250,240,.72);padding:9px 10px;cursor:pointer;text-align:left;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;column-gap:9px;row-gap:4px;align-items:center;transition:.18s ease}
.ip-card.active,.ip-card:hover{background:var(--sheet);border-color:var(--red);transform:translateY(0)}
.ip-card.coming{opacity:.68}
.ip-card.coming:not(.active){border-style:dashed}
.ip-card small{color:var(--red);align-self:start;padding-top:3px}
.ip-card b{font:800 20px/1.05 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:0}
.ip-card span{grid-column:2;color:var(--muted);font-size:10px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.main-stack{min-width:0;min-height:0;display:grid;grid-template-rows:auto auto auto auto;align-content:start;gap:10px;overflow:visible;padding-right:0}
.story{background:var(--sheet);border:1px solid var(--line);padding:12px 16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,420px);gap:16px;align-items:end;min-width:0;min-height:0;overflow:visible}
.story .eyebrow{color:var(--red)}
.story h1{margin:6px 0 0;font:800 clamp(34px,3.2vw,52px)/.94 var(--display);letter-spacing:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.story-intro{min-width:0}
.story-intro>p{margin:7px 0 0;color:var(--muted);font-size:12px;line-height:1.5;max-width:780px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
.story-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line);border-left:1px solid var(--line);background:rgba(238,231,218,.18)}
.story-metrics div{min-width:0;padding:10px 11px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.story-metrics b{display:block;font-size:24px;line-height:1;white-space:nowrap}
.story-metrics span{display:block;margin-top:7px;color:var(--muted);font:800 9px var(--mono);letter-spacing:.12em}
.detail-section{background:var(--sheet);border:1px solid var(--line);padding:20px;display:grid;grid-template-columns:minmax(320px,1fr) minmax(560px,2fr);gap:18px;align-items:start}
.research-card{min-width:0}
.research-card span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.research-card strong{display:block;margin-top:10px;font-size:14px;line-height:1.65;color:var(--ink)}
.research-card ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:8px}
.research-card li{position:relative;padding-left:14px;color:var(--muted);font-size:12px;line-height:1.55}
.research-card li:before{content:"";position:absolute;left:0;top:.72em;width:5px;height:1px;background:var(--red)}
.framework{min-width:0;border-left:1px solid var(--line);padding-left:18px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px}
.framework>span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.framework-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;min-width:0}
.framework-grid div{min-width:0;border:1px solid var(--line);padding:11px;background:rgba(238,231,218,.24)}
.framework small{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.08em}
.framework b{display:block;margin-top:8px;font-size:13px}
.framework p{margin:8px 0 0;color:var(--muted);font-size:11px;line-height:1.55}
.site-note{border:1px solid var(--line);padding:14px 16px;background:rgba(255,250,240,.56);display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;gap:12px;align-items:center}
.site-note b{display:block;font:800 12px var(--mono);letter-spacing:.22em;white-space:nowrap}
.site-note span{display:block;color:var(--red);font:800 10px var(--mono);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
.site-note p{margin:0;color:var(--muted);font-size:12px;line-height:1.5;min-width:0}
.site-note small{display:block;color:var(--muted);font-size:11px;line-height:1.4;white-space:nowrap}
.site-note small a{color:inherit;text-decoration:none}
.site-note small a:hover{color:var(--red)}
.feature{background:var(--sheet);color:var(--ink);border:1px solid var(--line);padding:12px;display:block;min-width:0;min-height:0;overflow:visible}
.feature-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:start}
.feature-head>div{min-width:0}
.feature h2{margin:3px 0 0;font:800 clamp(26px,2.1vw,40px)/1.02 var(--display);letter-spacing:0;max-width:1120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feature p{margin:6px 0 0;color:var(--muted);font-size:11px;line-height:1.45;max-width:1120px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow-wrap:anywhere;word-break:break-word}
.version-switch{display:grid;grid-template-columns:68px minmax(0,1fr);gap:8px;align-items:stretch;width:100%;min-width:0;margin-top:10px}
.version-switch>span{border:1px solid var(--line);display:grid;place-items:center;padding:0 8px;color:var(--muted);font:800 9px var(--mono);letter-spacing:.14em;white-space:nowrap}
.count{color:var(--muted);text-align:right;line-height:1.7}
.stage{min-height:0;display:block;overflow:visible;position:relative;background:var(--sheet);margin-top:10px}
.image-shell{position:relative;width:100%;aspect-ratio:16/9;background:#f7f0e5;border:1px solid var(--line);overflow:hidden}
.main-image{position:absolute;inset:0;width:100%;height:100%;min-width:0;min-height:0;border:0;display:block;padding:0;background:#f7f0e5;cursor:zoom-in;color:inherit;overflow:hidden}
.main-image img{position:absolute;inset:0;display:block;width:100%;height:100%;aspect-ratio:16/9;object-fit:contain;background:#f7f0e5;transform:none}
.zoom-hint{position:absolute;right:18px;bottom:18px;background:rgba(255,250,240,.9);border:1px solid var(--line);padding:8px 10px;color:var(--muted);font:800 10px var(--mono);letter-spacing:.12em;opacity:0;transform:translateY(4px);transition:.18s ease}
.main-image:hover .zoom-hint{opacity:1;transform:translateY(0)}
.page-arrow{position:absolute;top:50%;z-index:3;transform:translateY(-50%);width:44px;height:68px;border:1px solid var(--line);background:rgba(255,250,240,.72);color:var(--ink);cursor:pointer;font-size:22px;display:grid;place-items:center}
.page-arrow:hover{background:var(--ink);color:var(--sheet)}
.page-arrow-prev{left:10px}
.page-arrow-next{right:10px}
.thumbs{height:92px;min-height:0;display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding-bottom:2px;margin-top:8px;scrollbar-width:thin;scrollbar-color:var(--line) transparent;background:var(--sheet)}
.thumbs button{flex:0 0 136px;border:1px solid var(--line);background:rgba(238,231,218,.22);padding:4px;cursor:pointer;min-width:0;position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto}
.thumbs button.active{border-color:var(--red);background:rgba(157,56,46,.06)}
.thumbs img{display:block;width:100%;height:100%;aspect-ratio:16/9;object-fit:cover;background:transparent}
.thumbs span{display:block;margin-top:4px;color:var(--muted);font:800 8px var(--mono);letter-spacing:.08em;text-align:left}
.thumbs button.active span{color:var(--ink)}
.caption{min-width:0;min-height:0;border-top:1px solid var(--line);padding-top:8px;margin-top:8px;display:grid;grid-template-columns:auto auto minmax(0,1fr);gap:12px;align-items:center;width:100%;background:var(--sheet)}
.caption b{font-size:18px}
.caption span{display:block;color:var(--muted);font:800 10px var(--mono);letter-spacing:.16em;white-space:nowrap}
.tools{display:flex;justify-content:flex-end;gap:8px;min-width:0}
.tools>button{border:1px solid var(--line);background:transparent;color:var(--ink);padding:11px 10px;cursor:pointer;white-space:nowrap;font:800 10px var(--mono);letter-spacing:.12em;text-align:center}
.tools>button:hover{background:var(--ink);color:var(--sheet)}
.version{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;min-width:0;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.version button{color:var(--muted);border-color:var(--line);flex:1 1 0;min-width:122px;text-align:left;padding:7px 10px;background:rgba(238,231,218,.18)}
.version button b,.version button small{display:block}
.version button b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.version button small{margin-top:4px;color:var(--muted);font-size:10px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.version button.active,.version button:hover{background:var(--ink);color:var(--sheet);border-color:var(--ink)}
.version button.active small,.version button:hover small{color:rgba(255,250,240,.68)}
.placeholder{width:100%;aspect-ratio:16/9;background:var(--sheet);color:var(--ink);display:grid;align-content:space-between;padding:22px}
.placeholder strong{font:700 52px/.85 var(--display);letter-spacing:0}
.placeholder span{color:var(--red);font:800 10px var(--mono);letter-spacing:.2em;text-transform:uppercase}
.thumb-placeholder{padding:10px}
.thumb-placeholder strong{font-size:24px}
.reader{position:fixed;inset:0;background:rgba(10,10,9,.96);z-index:30;display:grid;grid-template-rows:auto minmax(0,1fr) auto;place-items:center;padding:22px;color:var(--sheet)}
.reader-top{width:100%;display:flex;justify-content:space-between;align-items:start;gap:18px}
.reader-top span{display:block;color:rgba(255,250,240,.48);font:800 10px var(--mono);letter-spacing:.18em;text-transform:uppercase}
.reader-top b{display:block;margin-top:6px;font-size:24px}
.reader-top button,.reader-nav,.reader-bottom button{border:1px solid rgba(255,250,240,.24);background:transparent;color:var(--sheet);padding:11px 14px;cursor:pointer;font-weight:800}
.reader img{max-width:min(92vw,1680px);max-height:76vh;object-fit:contain;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.42)}
.reader-nav{position:absolute;top:50%;transform:translateY(-50%)}
.reader-nav.prev{left:22px}
.reader-nav.next{right:22px}
.reader-bottom{display:flex;align-items:center;justify-content:center;gap:16px;color:rgba(255,250,240,.48);font:800 11px var(--mono);letter-spacing:.18em}
.reader-bottom button{display:none}
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
  .top,.workspace{grid-template-columns:1fr}
  .top-actions{justify-content:flex-start}
  .workspace,.main-stack{overflow:visible}
  .rail{grid-template-rows:auto;position:static;max-height:none}
  .shelf{display:flex;overflow-x:auto;overflow-y:hidden;padding-right:0;padding-bottom:8px}
  .ip-card{flex:0 0 200px}
  .site-note{grid-template-columns:1fr}
  .site-note small{white-space:normal}
  .story,.detail-section{grid-template-columns:1fr;max-height:none;overflow:visible}
  .story-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}
  .framework{border-left:0;border-top:1px solid var(--line);padding-left:0;padding-top:14px}
  .framework-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .feature,.stage{overflow:visible}
  .feature-head{grid-template-columns:1fr}
  .image-shell{width:100%}
  .page-arrow{top:50%}
  .caption{grid-template-columns:1fr}
  .thumbs{height:auto;overflow:auto}
  .thumbs button{flex-basis:130px}
  .tools{justify-content:flex-start;flex-wrap:wrap}
  .version-switch{max-width:100%}
  .version{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));overflow:visible;width:100%}
  .version button{min-width:0}
}
@media(max-width:680px){
  .annual-app{padding:14px}
  .top{gap:14px}
  .story,.feature,.detail-section{padding:16px}
  .ip-card{flex-basis:184px}
  .story h1{font-size:48px;white-space:normal;overflow:visible;text-overflow:clip}
  .framework-grid{grid-template-columns:1fr}
  .story-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}
  .story-metrics div{padding:9px 8px}
  .story-metrics b{font-size:20px}
  .story-metrics span{font-size:8px;letter-spacing:.06em}
  .feature h2{font-size:26px;line-height:1.12;max-width:100%;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;line-break:anywhere}
  .feature p{max-width:100%}
  .feature-head,.version-switch{grid-template-columns:1fr}
  .version{grid-template-columns:1fr}
  .stage{gap:12px}
  .page-arrow{width:38px;height:56px;top:50%}
  .thumbs button{min-width:130px}
  .tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;width:100%}
  .tools>button{min-width:0;padding:10px 6px;font-size:8px;letter-spacing:.04em}
  .research-sections{grid-template-columns:1fr}
  .reader{background:#0a0a09;grid-template-rows:auto minmax(0,1fr) auto;place-items:stretch;padding:calc(14px + env(safe-area-inset-top)) 14px calc(14px + env(safe-area-inset-bottom));gap:14px}
  .reader-top{align-items:center}
  .reader-top span{font-size:9px;letter-spacing:.14em}
  .reader-top b{font-size:20px;line-height:1.15}
  .reader-top button{padding:10px 13px;white-space:nowrap}
  .reader img{align-self:center;justify-self:center;width:100%;max-width:100%;max-height:calc(100svh - 190px);box-shadow:none}
  .reader-nav{display:none}
  .reader-bottom{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
  .reader-bottom button{display:block;padding:12px 10px}
  .reader-bottom span{text-align:center;white-space:nowrap}
}
`;
