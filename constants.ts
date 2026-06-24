import { Scheme } from './types';

export const CATEGORIES = ['全部', '策略方案', '创意设计', '融资路演', '工作汇报', '品牌手册'];

/**
 * Enhanced Kraft & Manila Palette
 * 用于模拟真实的档案袋内外色差 - 调整为浅米色系
 */
export const PALETTE = {
  KRAFT_OUTER: '#D8CBB7', // 外部口袋色 - 浅米色
  KRAFT_INNER: '#EBE3D5', // 内部背板色 - 极浅米色
  VINTAGE_STAMP: '#2A2A2A', // 复古印章色
};

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: '1',
    title: '快手2026CNY招商项目通案',
    category: '营销方案',
    date: '2026-01-04',
    description: '平台春节节点 IP 的年度招商方案，适合观察晚会资源、达人内容、站内曝光与品牌权益如何被组合售卖。',
    tags: ['春节', '平台招商', '晚会IP'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    brand: '快手',
    industry: '节点营销',
    downloadUrl: '#',
    year: '2026',
    displayId: 'IP-001',
    fileSize: '18.6M',
    pageCount: '78',
    isFeatured: true,
    platform: '快手',
    ipName: '快手春节 IP',
    projectType: '招商案',
    archiveType: '招商 PDF',
    ipStage: '第4年',
    slogan: '快手马年星晚',
    editorNote: '这类平台春节 IP 的核心价值不只是流量，而是把品牌放进春节内容场景里，让品牌有理由参与节点传播。',
    keyChange: '从单一曝光资源，升级为晚会内容、达人传播和电商转化的组合权益。',
    partners: ['快消', '电商', '酒水'],
    rights: ['晚会资源', '站内曝光', '达人共创', '直播互动'],
    resultSummary: '适合用于春节节点提案、平台招商对比和年度 IP 演进观察。'
  },
  {
    id: '2',
    title: '抖音节气文化 IP 招商方案',
    category: '营销方案',
    date: '2025-12-18',
    description: '围绕节气文化搭建的内容 IP，适合观察平台如何把传统文化、达人内容和品牌种草包装成长期合作资产。',
    tags: ['节气', '文化营销', '内容IP'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
    brand: '抖音',
    industry: '内容营销',
    downloadUrl: '#',
    year: '2025',
    displayId: 'IP-002',
    fileSize: '12.4M',
    pageCount: '38',
    platform: '抖音',
    ipName: '抖音节气 IP',
    projectType: '招商案',
    archiveType: '招商 PDF',
    ipStage: '第2年',
    slogan: '最是人间好时节',
    editorNote: '节气 IP 的优势在于天然有内容日历，可持续复用，适合品牌做轻量、连续、低门槛的内容参与。',
    keyChange: '从单点节日借势，走向全年内容资产与达人共创。',
    partners: ['食品饮料', '美妆', '文旅'],
    rights: ['话题资源', '达人内容', '节点专题', '平台推荐'],
    resultSummary: '适合参考其内容日历和节点化包装方式。'
  },
  {
    id: '3',
    title: '小红书营销 IP 年度通案',
    category: '营销方案',
    date: '2025-11-26',
    description: '小红书围绕生活方式与种草场景搭建的营销 IP，总结其人群、场景、内容与品牌合作逻辑。',
    tags: ['小红书', '种草', '生活方式'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    brand: '小红书',
    industry: '种草营销',
    downloadUrl: '#',
    year: '2025',
    displayId: 'IP-003',
    fileSize: '22.0M',
    pageCount: '100',
    platform: '小红书',
    ipName: '小红书营销 IP',
    projectType: '年度通案',
    archiveType: '平台通案',
    ipStage: '长期 IP',
    slogan: '从真实生活里长出品牌种草',
    editorNote: '小红书类 IP 的价值在于把品牌需求翻译成生活场景，而不是单纯购买曝光。',
    keyChange: '品牌合作从达人投放，逐步转向场景共创、生活方式议题和搜索资产沉淀。',
    partners: ['美妆', '快消', '母婴', '家居'],
    rights: ['场景专题', '达人共创', '搜索沉淀', '笔记扩散'],
    resultSummary: '适合用于种草提案、生活方式品牌和新品上市方向参考。'
  }
];
