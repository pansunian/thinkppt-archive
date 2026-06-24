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
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    thesis: '从“慢下来”到“重回一倍速生活”，小红书把生活方式态度包装成可招商的长期内容 IP。',
    authorNote: '慢人节最值得研究的不是某一份 PPT，而是它如何把一种人群情绪变成平台可反复售卖的营销资产。',
    versions: [
      {
        year: '2024',
        title: '2024小红书慢人节招商通案',
        phase: 'IP 建立期',
        planSummary: '用“慢生活”作为情绪入口，承接品牌对生活方式人群的沟通需求。',
        materials: ['主题 KV', '生活方式海报', '站内话题页'],
        pageCount: '51',
        fileSize: '48.8M',
        visuals: ['https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80'],
        schemePages: [
          {
            label: '封面',
            title: '慢人节主视觉与命名',
            role: '让人一眼识别这不是普通活动，而是小红书生活方式 IP。',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            note: '真实接入时建议用 PDF 第 1 页封面，保留原始版面，不再叠加大段文字。'
          },
          {
            label: '洞察',
            title: '年轻人为什么需要慢下来',
            role: '说明情绪背景：内卷、内耗、躺平之间的摆动，让“慢”成为可被品牌进入的生活态度。',
            image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1200&q=80',
            note: '来自 Notion 页面中的洞察线索：CityWalk、抱树、公园发呆、Staycation 等慢生活行为。'
          },
          {
            label: '人群',
            title: '慢人生活方式人群',
            role: '把抽象情绪落到可招商的人群和生活场景。',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
            note: '适合展示 PDF 中的人群画像、生活方式标签和消费场景页。'
          },
          {
            label: '主题',
            title: '从“慢下来”到活动主题',
            role: '展示 IP 的核心表达如何从洞察转译为年度主题。',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            note: '这里未来放主题页或 Big Idea 页。'
          },
          {
            label: '玩法',
            title: '站内内容与线下生活场景',
            role: '展示这个 IP 如何被用户参与、被达人扩散、被品牌共创。',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            note: '建议从 PDF 中抽取话题页、活动机制页或达人共创页。'
          },
          {
            label: '权益',
            title: '品牌可以购买什么',
            role: '把平台资源、内容资源、达人资源和权益组合讲清楚。',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
            note: '招商案最有价值的部分之一，建议保留 1-2 页权益结构。'
          },
          {
            label: '脉络',
            title: '预热、爆发、沉淀的节奏',
            role: '让读者看懂一份方案不是页面堆叠，而是一条传播路径。',
            image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
            note: '适合展示时间轴、阶段规划、资源节奏页。'
          },
          {
            label: '收束',
            title: '为什么它值得长期跟踪',
            role: '回到 IP 年鉴价值：它如何变成可复用的平台招商模型。',
            image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            note: '这里可以由 ThinkPPT 写站长短评，不需要来自原 PDF。'
          }
        ],
        evidencePoints: ['公开报告页出现“2024小红书慢人节《慢人生活图鉴》”', '同页收录“2024小红书慢人节招商通案”', '小红书站内搜索会混入“慢人音乐节”，需要用 PDF 原件校准'],
        sourceTitle: '发现报告：2024小红书慢人生活趋势图鉴',
        sourceUrl: 'https://www.fxbaogao.com/detail/4521972',
        execution: '适合品牌做情绪价值、生活方式、户外休闲与轻疗愈方向。'
      },
      {
        year: '2025',
        title: '小红书慢人节2025年长线IP规划',
        phase: '长线运营期',
        planSummary: '从单次活动升级为长线 IP 规划，强调全年内容沉淀和品牌共创。',
        materials: ['年度规划', '城市生活物料', '品牌共创模版'],
        visuals: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'],
        evidencePoints: ['公开报告平台收录“2025小红书慢人节提案”条目', '适合在你的 Notion/PDF 中补充招商权益和真实页码', '建议把它作为“趋势报告 + 招商方案”双资料形态呈现'],
        sourceTitle: '发现报告：小红书慢人节相关报告目录',
        sourceUrl: 'https://www.fxbaogao.com/detail/4521972',
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
    coverImage: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=80',
    thesis: '雪人节把冬季情绪、礼赠场景和社区分享结合起来，适合做年末节点营销。',
    authorNote: '这个 IP 的关键是“氛围感”而不是强促销，适合品牌进入用户年末生活语境。',
    versions: [
      {
        year: '2024',
        title: '2024小红书雪人节招商方案',
        phase: '节点验证期',
        planSummary: '围绕冬日、礼赠、陪伴与情绪价值组织内容玩法。',
        materials: ['雪人视觉', '冬日打卡物料', '礼赠场景海报'],
        visuals: ['https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=600&q=80'],
        evidencePoints: ['TOM资讯提到“玩雪大提案”带动站内话题阅读量近3亿', '本届雪人节在阿勒泰打造“赏雪猎人”企划', '现场合作品牌包括华为、飞鹤等多个行业品牌'],
        sourceTitle: 'TOM资讯：小红书雪人节开启关于雪的快乐升级',
        sourceUrl: 'https://news.tom.com/202412/4793035568.html',
        execution: '适合美妆、食品、服饰、家居等年末场景品牌。'
      },
      {
        year: '2025',
        title: '小红书雪人节招商方案',
        phase: '权益升级期',
        planSummary: '强化平台资源、达人共创和搜索沉淀，让品牌参与路径更清晰。',
        materials: ['招商权益页', '达人共创示例', '站内活动页'],
        pageCount: '29',
        fileSize: '6.4M',
        visuals: ['https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'],
        schemePages: [
          {
            label: '封面',
            title: '雪人节年度封面',
            role: '建立冬季节点 IP 的第一印象，决定“氛围感”是否成立。',
            image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=80',
            note: '真实接入时用 PDF 封面，不在图片上压说明文字。'
          },
          {
            label: '洞察',
            title: '冬季情绪与分享欲',
            role: '把雪、旅行、礼赠、陪伴这些情绪场景解释成品牌机会。',
            image: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&q=80',
            note: 'Notion 中这份方案共 29 页，适合抽取 6-8 页做导览阅读。'
          },
          {
            label: '场景',
            title: '阿勒泰、哈尔滨与城市雪场',
            role: '展示平台如何把热门目的地转化为内容场景。',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            note: '未来放城市/目的地/打卡场景页。'
          },
          {
            label: '主题',
            title: '玩雪大提案',
            role: '将用户自发兴趣包装成平台级活动主张。',
            image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
            note: '可对应 PDF 里的主题页或活动主张页。'
          },
          {
            label: '玩法',
            title: '站内话题、达人共创、线下体验',
            role: '展示雪人节如何从内容活动变成可参与的营销项目。',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
            note: '可抽取活动机制页、达人合作页、站内资源页。'
          },
          {
            label: '权益',
            title: '品牌合作权益结构',
            role: '让付费读者快速看到招商案最有参考价值的部分。',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            note: '建议保留原 PDF 中的权益矩阵，不做过度改写。'
          },
          {
            label: '脉络',
            title: '预热到爆发的传播路径',
            role: '用时间线理解这类冬季节点 IP 的运作方式。',
            image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
            note: '适合展示排期页、资源节奏页。'
          },
          {
            label: '收束',
            title: '冬季 IP 如何被复用',
            role: '为读者提供“拿来分析”的营销方法，而不只是看图。',
            image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=80',
            note: '这里适合放 ThinkPPT 的策展短评。'
          }
        ],
        evidencePoints: ['小红书站内搜索出现活动入口、哈尔滨、阿勒泰、新疆等相关筛选词', '可补充 2025 年实际城市/品牌合作后形成年度对比', '建议未来按“预热-主会场-城市联动-品牌补给站”拆解'],
        sourceTitle: '小红书站内搜索：雪人节',
        sourceUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E5%B0%8F%E7%BA%A2%E4%B9%A6%20%E9%9B%AA%E4%BA%BA%E8%8A%82',
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
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    thesis: '外人节把“非主流生活选择”转化成品牌可参与的人群态度表达。',
    authorNote: '它的商业价值在于帮品牌进入年轻人的自我表达，而不是简单做一个节日。',
    versions: [
      {
        year: '2024',
        title: '2024小红书外人节3.0招商通案',
        phase: 'IP 成熟期',
        planSummary: '通过“外人”身份叙事，连接年轻用户的个性表达和兴趣圈层。',
        materials: ['态度海报', '圈层内容模版', 'UGC 话题页'],
        pageCount: '待补',
        fileSize: '待补',
        visuals: ['https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'],
        schemePages: [
          {
            label: '封面',
            title: '外人节 3.0 招商通案',
            role: '用反常规命名制造人群身份感。',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
            note: '待接入真实 PDF 后替换封面图。'
          },
          {
            label: '洞察',
            title: '年轻人的“外人”身份表达',
            role: '把不合群、出走、断网、户外等态度转化成品牌沟通语境。',
            image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
            note: '这是外人节区别于普通户外活动的关键。'
          },
          {
            label: '人群',
            title: '兴趣圈层与生活态度',
            role: '说明这个 IP 不是大众节日，而是圈层身份的商业包装。',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            note: '未来可抽取人群画像、圈层标签页。'
          },
          {
            label: '主题',
            title: '户外 48 小时',
            role: '把“外人”态度落到一个可参与、可传播的行动主题。',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            note: '可对应主题页、口号页或年度主张页。'
          },
          {
            label: '玩法',
            title: '线下节日与站内话题联动',
            role: '解释平台 IP 如何连接真实活动与内容扩散。',
            image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            note: '适合展示活动机制、达人参与、UGC 路径。'
          },
          {
            label: '权益',
            title: '品牌进入圈层的方式',
            role: '看品牌如何不突兀地进入年轻人的态度表达。',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
            note: '未来放权益矩阵和合作行业页。'
          },
          {
            label: '脉络',
            title: '从概念到节日的递进',
            role: '还原招商案中的叙事顺序，帮助读者学习提案结构。',
            image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
            note: '适合展示目录、阶段推进、传播节奏页。'
          },
          {
            label: '收束',
            title: '态度 IP 的可复用模型',
            role: '总结外人节对营销人的参考价值。',
            image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
            note: '由 ThinkPPT 增补策展短评。'
          }
        ],
        evidencePoints: ['数英案例记录了外人节早期的户外生活节 IP 打造', 'SocialBeta 提到 2025 第四届外人节以“户外 48 小时”为主题', '2024 外人节案例提到第三届联动品牌和 100+ 明星博主'],
        sourceTitle: 'SocialBeta：小红书请你「断网」48 小时',
        sourceUrl: 'https://socialbeta.com/campaign/25654',
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
    coverImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80',
    thesis: '夜人节围绕夜间生活、情绪陪伴和城市消费，打开品牌夜经济场景。',
    authorNote: '这个 IP 的想象空间在于城市夜生活和年轻人的精神状态，非常适合做内容化招商。',
    versions: [
      {
        year: '2025',
        title: '2025小红书夜人节招商方案',
        phase: 'IP 启动期',
        planSummary: '以夜间生活方式为核心，组织城市、消费、社交和情绪内容。',
        materials: ['夜间 KV', '城市地图', '夜生活内容模板'],
        visuals: ['https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=80'],
        execution: '适合酒饮、餐饮、出行、文旅和线上娱乐品牌。'
      }
    ]
  },
  {
    id: 'xhs-street-life',
    platform: '小红书',
    name: '马路生活节',
    type: '城市生活 IP',
    years: '2024-2025',
    coverImage: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    thesis: '马路生活节把街区、出行、咖啡、餐饮和城市漫游连接起来，让品牌进入真实生活半径。',
    authorNote: '它适合成为 ThinkPPT 的重点样本：因为它不是一个单点促销活动，而是能持续观察“城市生活方式商业化”的平台 IP。',
    versions: [
      {
        year: '2024',
        title: '2024小红书马路生活节招商方案',
        phase: '街区场景期',
        planSummary: '以城市街区和日常出行为入口，把咖啡、餐饮、骑行、宠物、户外等生活场景组织成可招商资源。',
        materials: ['街区主视觉', '城市地图', '品牌打卡路线'],
        visuals: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80'],
        evidencePoints: ['广告门称马路生活节为小红书年度 S 级 IP 项目', '2023 主题线索为“生活不在别处，灵感撒满马路”', '项目核心是把 App 里的社区生活搬回城市线下'],
        sourceTitle: '广告门：第二届小红书马路生活节快乐施工花絮',
        sourceUrl: 'https://www.adquan.com/article/347038',
        execution: '适合本地生活、咖啡茶饮、出行、户外、文旅和生活方式品牌。'
      },
      {
        year: '2025',
        title: '小红书马路生活节年度共创规划',
        phase: '城市资产期',
        planSummary: '从单次街区活动升级为城市内容资产，把线下体验、达人笔记和搜索沉淀串联起来。',
        materials: ['年度共创包', '商圈合作物料', '达人路线模板'],
        visuals: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80'],
        evidencePoints: ['小红书站内搜索出现“马路生活节3.0全新玩法大揭秘”', '站内结果出现“上海-广州-杭州，马路生活节首次三城”线索', '数英记录 2024 预热创意“大黄鸭，接你出来鸭马路呀”'],
        sourceTitle: '小红书站内搜索：马路生活节',
        sourceUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E5%B0%8F%E7%BA%A2%E4%B9%A6%20%E9%A9%AC%E8%B7%AF%E7%94%9F%E6%B4%BB%E8%8A%82',
        execution: '价值从“城市打卡”升级为“可复用的生活方式招商模型”。'
      }
    ]
  },
  {
    id: 'xhs-youth',
    platform: '小红书',
    name: '闪光青春派',
    type: '开学季 IP',
    years: '2024-2025',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    thesis: '闪光青春派把开学季从促销节点改造成青年人群的生活方式和身份表达。',
    authorNote: '它适合观察小红书如何把学生人群、校园场景和消费品牌组织到同一个内容 IP 里。',
    versions: [
      {
        year: '2024',
        title: '2024小红书闪光开学季招商通案',
        phase: '开学节点期',
        planSummary: '围绕开学焕新、校园表达和青年生活方式展开招商。',
        materials: ['开学季 KV', '校园场景海报', '种草内容模板'],
        visuals: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'],
        execution: '适合数码、美妆、服饰、文具、食品品牌。'
      },
      {
        year: '2025',
        title: '【2025小红书开学季】闪光开学季招商通案',
        phase: '人群资产期',
        planSummary: '从开学节点走向青年生活方式内容资产，品牌可以围绕校园身份做长期表达。',
        materials: ['青年人群洞察', '达人内容示例', '站内资源权益'],
        visuals: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'],
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
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    thesis: '拜年纪是 B站春节内容商业化的核心样本，连续多年演进出更强的大众文化叙事。',
    authorNote: '它最值得跟踪的是：B站如何从二次元社区 IP，逐步走向更大众化的春节文化表达。',
    versions: [
      {
        year: '2024',
        title: '2024百大UP主盛典 / 拜年纪相关招商',
        phase: '社区内容期',
        planSummary: '强调社区内容、UP主参与和年轻人春节表达。',
        materials: ['主视觉', 'UP主权益', '站内资源'],
        visuals: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80'],
        execution: '适合观察 B站春节资源的基础招商逻辑。'
      },
      {
        year: '2025',
        title: '哔哩哔哩2025拜年纪招商方案',
        phase: '商业成熟期',
        planSummary: '合作权益更清晰，品牌参与方式从曝光走向内容共创。',
        materials: ['招商权益', '品牌合作案例', '虚拟内容资源'],
        visuals: ['https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'],
        execution: '适合品牌春节年轻化沟通参考。'
      },
      {
        year: '2026',
        title: '2026拜年纪招商方案',
        phase: '大众文化升级期',
        planSummary: '进一步强调传统文化、二次元表达和春节大众叙事融合。',
        materials: ['国风视觉', '内容合作权益', 'IP 联名资源'],
        visuals: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'],
        execution: '可作为平台大 IP 商业化演进的关键样本。'
      }
    ]
  }
];
