import { Scheme, Collection } from './types';

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
    title: '科技融资_Series_A',
    category: '融资路演',
    date: '2024-10-24',
    description: '针对A轮融资的完整路演架构。重点展示市场规模(TAM/SAM/SOM)和早期牵引力指标。',
    tags: ['#融资', '#SaaS'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    brand: 'TechFlow',
    industry: '互联网/SaaS',
    downloadUrl: '#',
    year: '2024',
    displayId: '1001',
    fileSize: '6.8M',
    pageCount: '22',
    isFeatured: true 
  },
  {
    id: '2',
    title: 'Q3_市场营销复盘',
    category: '工作汇报',
    date: '2024-11-02',
    description: '季度营销复盘模板，强调KPI可视化和各渠道转化率漏斗分析。',
    tags: ['#数据', '#营销'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    brand: 'EcoMarket',
    industry: '消费零售',
    downloadUrl: '#',
    year: '2024',
    displayId: '1002',
    fileSize: '4.5M',
    pageCount: '15'
  },
  {
    id: '3',
    title: '极简品牌VI手册',
    category: '品牌手册',
    date: '2023-09-15',
    description: '瑞士风格排版，用于规范品牌标识、色彩系统 and 排版层级。',
    tags: ['#品牌', '#极简'],
    color: PALETTE.KRAFT_OUTER, 
    imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    brand: 'Studio A',
    industry: '设计创意',
    downloadUrl: '#',
    year: '2023',
    displayId: '1003',
    fileSize: '12.0M',
    pageCount: '38',
    isFeatured: true
  }
];

// 模拟策展合辑数据
export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: '初创公司融资实战',
    subtitle: 'The Startup Fundraising Kit',
    description: '从种子轮到 A 轮，我们精选了 3 套不同阶段的融资路演方案。这些方案不仅设计精良，更重要的是逻辑结构经过了实战验证，帮助创始人讲好商业故事。',
    coverImage: 'https://images.unsplash.com/photo-1553877607-3ea980560deb?auto=format&fit=crop&w=1200&q=80',
    schemeIds: ['1', '1001'], // 关联 MOCK_SCHEMES 中的 ID
    themeColor: '#1A1A1A'
  },
  {
    id: 'c2',
    title: '极简主义排版美学',
    subtitle: 'Minimalist Typography',
    description: '少即是多。本期展览聚焦于那些“留白”艺术运用得当的方案。即使没有复杂的图表，仅靠文字排版和网格系统，也能传递出高级的品牌质感。',
    coverImage: 'https://images.unsplash.com/photo-1496115965489-21be7e6e59a0?auto=format&fit=crop&w=1200&q=80',
    schemeIds: ['3', '1003'],
    themeColor: '#D32F2F'
  }
];