import { IpArchive, Scheme } from './types';

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

export const CURATED_IP_ARCHIVES: IpArchive[] = [
  {
    id: 'xhs-slow-life',
    platform: '小红书',
    name: '慢人节',
    type: '生活方式 IP',
    years: '2024-2025',
    thesis: '从“慢下来”到“重回一倍速生活”，小红书把生活方式态度包装成可招商的长期内容 IP。',
    authorNote: '慢人节最值得研究的不是某一份 PPT，而是它如何把一种人群情绪变成平台可反复售卖的营销资产。',
    versions: [
      {
        year: '2024',
        title: '2024小红书慢人节招商通案',
        phase: 'IP 建立期',
        planSummary: '用“慢生活”作为情绪入口，承接品牌对生活方式人群的沟通需求。',
        materials: ['主题 KV', '生活方式海报', '站内话题页'],
        execution: '适合品牌做情绪价值、生活方式、户外休闲与轻疗愈方向。'
      },
      {
        year: '2025',
        title: '小红书慢人节2025年长线IP规划',
        phase: '长线运营期',
        planSummary: '从单次活动升级为长线 IP 规划，强调全年内容沉淀和品牌共创。',
        materials: ['年度规划', '城市生活物料', '品牌共创模版'],
        execution: '价值从“节点借势”升级为“持续人群资产”。'
      }
    ]
  },
  {
    id: 'xhs-snowman',
    platform: '小红书',
    name: '雪人节',
    type: '冬季节点 IP',
    years: '2024-2025',
    thesis: '雪人节把冬季情绪、礼赠场景和社区分享结合起来，适合做年末节点营销。',
    authorNote: '这个 IP 的关键是“氛围感”而不是强促销，适合品牌进入用户年末生活语境。',
    versions: [
      {
        year: '2024',
        title: '2024小红书雪人节招商方案',
        phase: '节点验证期',
        planSummary: '围绕冬日、礼赠、陪伴与情绪价值组织内容玩法。',
        materials: ['雪人视觉', '冬日打卡物料', '礼赠场景海报'],
        execution: '适合美妆、食品、服饰、家居等年末场景品牌。'
      },
      {
        year: '2025',
        title: '小红书雪人节招商方案',
        phase: '权益升级期',
        planSummary: '强化平台资源、达人共创和搜索沉淀，让品牌参与路径更清晰。',
        materials: ['招商权益页', '达人共创示例', '站内活动页'],
        execution: '从氛围型活动升级为可售卖的冬季 IP 资源包。'
      }
    ]
  },
  {
    id: 'xhs-outsider',
    platform: '小红书',
    name: '外人节',
    type: '人群态度 IP',
    years: '2024-2025',
    thesis: '外人节把“非主流生活选择”转化成品牌可参与的人群态度表达。',
    authorNote: '它的商业价值在于帮品牌进入年轻人的自我表达，而不是简单做一个节日。',
    versions: [
      {
        year: '2024',
        title: '2024小红书外人节3.0招商通案',
        phase: 'IP 成熟期',
        planSummary: '通过“外人”身份叙事，连接年轻用户的个性表达和兴趣圈层。',
        materials: ['态度海报', '圈层内容模版', 'UGC 话题页'],
        execution: '适合潮流、美妆、服饰、数码和兴趣消费品牌。'
      }
    ]
  },
  {
    id: 'xhs-night',
    platform: '小红书',
    name: '夜人节',
    type: '夜间生活 IP',
    years: '2025',
    thesis: '夜人节围绕夜间生活、情绪陪伴和城市消费，打开品牌夜经济场景。',
    authorNote: '这个 IP 的想象空间在于城市夜生活和年轻人的精神状态，非常适合做内容化招商。',
    versions: [
      {
        year: '2025',
        title: '2025小红书夜人节招商方案',
        phase: 'IP 启动期',
        planSummary: '以夜间生活方式为核心，组织城市、消费、社交和情绪内容。',
        materials: ['夜间 KV', '城市地图', '夜生活内容模板'],
        execution: '适合酒饮、餐饮、出行、文旅和线上娱乐品牌。'
      }
    ]
  },
  {
    id: 'xhs-youth',
    platform: '小红书',
    name: '闪光青春派',
    type: '开学季 IP',
    years: '2024-2025',
    thesis: '闪光青春派把开学季从促销节点改造成青年人群的生活方式和身份表达。',
    authorNote: '它适合观察小红书如何把学生人群、校园场景和消费品牌组织到同一个内容 IP 里。',
    versions: [
      {
        year: '2024',
        title: '2024小红书闪光开学季招商通案',
        phase: '开学节点期',
        planSummary: '围绕开学焕新、校园表达和青年生活方式展开招商。',
        materials: ['开学季 KV', '校园场景海报', '种草内容模板'],
        execution: '适合数码、美妆、服饰、文具、食品品牌。'
      },
      {
        year: '2025',
        title: '【2025小红书开学季】闪光开学季招商通案',
        phase: '人群资产期',
        planSummary: '从开学节点走向青年生活方式内容资产，品牌可以围绕校园身份做长期表达。',
        materials: ['青年人群洞察', '达人内容示例', '站内资源权益'],
        execution: '可作为品牌做 Z 世代和学生人群提案的参考样本。'
      }
    ]
  },
  {
    id: 'bili-bainianji',
    platform: 'bilibili',
    name: '拜年纪',
    type: '年度大 IP',
    years: '2024-2026',
    thesis: '拜年纪是 B站春节内容商业化的核心样本，连续多年演进出更强的大众文化叙事。',
    authorNote: '它最值得跟踪的是：B站如何从二次元社区 IP，逐步走向更大众化的春节文化表达。',
    versions: [
      {
        year: '2024',
        title: '2024百大UP主盛典 / 拜年纪相关招商',
        phase: '社区内容期',
        planSummary: '强调社区内容、UP主参与和年轻人春节表达。',
        materials: ['主视觉', 'UP主权益', '站内资源'],
        execution: '适合观察 B站春节资源的基础招商逻辑。'
      },
      {
        year: '2025',
        title: '哔哩哔哩2025拜年纪招商方案',
        phase: '商业成熟期',
        planSummary: '合作权益更清晰，品牌参与方式从曝光走向内容共创。',
        materials: ['招商权益', '品牌合作案例', '虚拟内容资源'],
        execution: '适合品牌春节年轻化沟通参考。'
      },
      {
        year: '2026',
        title: '2026拜年纪招商方案',
        phase: '大众文化升级期',
        planSummary: '进一步强调传统文化、二次元表达和春节大众叙事融合。',
        materials: ['国风视觉', '内容合作权益', 'IP 联名资源'],
        execution: '可作为平台大 IP 商业化演进的关键样本。'
      }
    ]
  }
];
