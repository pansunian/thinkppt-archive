import { Scheme } from './types';

export const CATEGORIES = ['全部', '策略方案', '创意设计', '融资路演', '工作汇报', '品牌手册'];

// Macaron Palette (9 distinct colors)
export const PALETTE = [
  '#FF9AA2', // Salmon Pink
  '#FFB7B2', // Soft Coral
  '#FFDAC1', // Peach
  '#E2F0CB', // Lime Sorbet
  '#B5EAD7', // Minty
  '#C7CEEA', // Periwinkle Blue
  '#E2C6FF', // Lavender
  '#FFC8DD', // Sakura
  '#FFF6BD', // Lemon Chiffon
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: '1',
    title: '科技融资_Series_A',
    category: '融资路演',
    date: 'OCT 24',
    description: '针对A轮融资的完整路演架构。重点展示市场规模(TAM/SAM/SOM)和早期牵引力指标。',
    tags: ['#融资', '#SaaS'],
    color: PALETTE[0], 
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    brand: 'TechFlow',
    industry: '互联网/SaaS',
    downloadUrl: '#',
    year: '2024'
  },
  {
    id: '2',
    title: 'Q3_市场营销复盘',
    category: '工作汇报',
    date: 'NOV 02',
    description: '季度营销复盘模板，强调KPI可视化和各渠道转化率漏斗分析。',
    tags: ['#数据', '#营销'],
    color: PALETTE[3], 
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    brand: 'EcoMarket',
    industry: '消费零售',
    downloadUrl: '#',
    year: '2024'
  },
  {
    id: '3',
    title: '极简品牌VI手册',
    category: '品牌手册',
    date: 'SEP 15',
    description: '瑞士风格排版，用于规范品牌标识、色彩系统和排版层级。',
    tags: ['#品牌', '#极简'],
    color: PALETTE[5], 
    imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    brand: 'Studio A',
    industry: '设计创意',
    downloadUrl: '#',
    year: '2023'
  },
  {
    id: '4',
    title: '2025_企业战略规划',
    category: '策略方案',
    date: 'JAN 10',
    description: '高层战略路线图模板。包含SWOT分析网格、PEST分析及未来5年增长地平线规划。',
    tags: ['#战略', '#规划'],
    color: PALETTE[2], 
    imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800',
    brand: 'FutureCorp',
    industry: '咨询服务',
    downloadUrl: '#',
    year: '2025'
  },
  {
    id: '5',
    title: '新品上市GTM策略',
    category: '策略方案',
    date: 'DEC 05',
    description: 'Go-to-Market 上市策略框架。包含用户画像定义、全渠道营销日历。',
    tags: ['#发布会', '#GTM'],
    color: PALETTE[6], 
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    brand: 'Nova Gear',
    industry: '3C数码',
    downloadUrl: '#',
    year: '2024'
  },
  {
    id: '6',
    title: 'UX设计作品集_V3',
    category: '创意设计',
    date: 'NOV 20',
    description: '设计师求职/展示专用。以“问题-过程-方案”为逻辑，大图展示高保真原型。',
    tags: ['#UX', '#作品集'],
    color: PALETTE[8], 
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=800',
    brand: 'Personal',
    industry: '互联网',
    downloadUrl: '#'
  , year: '2023'}
];