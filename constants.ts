
import { Scheme } from './types';

export const CATEGORIES = ['全部', '策略方案', '创意设计', '融资路演', '工作汇报', '品牌手册'];

/**
 * Enhanced Kraft & Manila Palette
 * 用于模拟真实的档案袋内外色差
 */
export const PALETTE = {
  KRAFT_OUTER: '#C09B73', // 外部口袋色
  KRAFT_INNER: '#DBC5A4', // 内部背板色
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
    // Added missing properties for Scheme interface compatibility
    fileSize: '6.8M',
    pageCount: '22'
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
    // Added missing properties for Scheme interface compatibility
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
    // Added missing properties for Scheme interface compatibility
    fileSize: '12.0M',
    pageCount: '38'
  }
];
