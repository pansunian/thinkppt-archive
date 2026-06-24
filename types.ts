
export interface Scheme {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  tags: string[];
  color: string; // The "folder" color hex code
  imageUrl: string; // Preview image
  brand: string;      // 品牌
  industry: string;   // 行业
  downloadUrl: string;// 下载地址
  year: string;       // New: 年份
  displayId: string;  // New: User visible ID from Notion 'ID' property
  fileSize: string;   // New: 文件大小 (例如 6.8M)
  pageCount: string;  // New: 方案页数 (例如 22 页)
  isFeatured?: boolean; // New: 是否为编辑推荐/精选
  platform: string;   // 平台：抖音 / 快手 / 小红书 / B站
  ipName: string;     // IP 项目名称
  projectType: string; // 项目类型：招商案 / 执行案 / 复盘案 / 物料
  archiveType: string; // 档案类型
  ipStage: string;    // 第几年 / 持续年限
  slogan: string;     // 当年主题或 Slogan
  ipPosition?: string; // IP 定位
  schemeRole?: string; // 方案角色
  annualTheme?: string; // 年度主题
  coreInsight?: string; // 核心洞察
  bigIdea?: string; // Big Idea
  schemeNarrative?: string; // 方案脉络
  curationSummary?: string; // 策展摘要
  featuredPageNumbers?: string; // 精选页码
  featuredPageTitles?: string; // 精选页标题
  featuredPageNotes?: string; // 精选页说明
  pdfOssUrl?: string; // OSS PDF 原件
  pageImagesOssPrefix?: string; // OSS 页面图目录
  coverOssUrl?: string; // OSS 封面图
  readingStatus?: string; // 阅读/整理状态
  editorNote: string; // 站长观察
  keyChange: string;  // 关键变化
  partners: string[]; // 合作品牌
  rights: string[];   // 招商权益
  resultSummary: string; // 执行效果摘要
}

export interface GeneratedOutline {
  title: string;
  sections: string[];
}

export interface IpArchiveSchemePage {
  label: string;
  title: string;
  role: string;
  image: string;
  note: string;
}

export interface IpArchiveVersion {
  year: string;
  title: string;
  phase: string;
  planSummary: string;
  materials: string[];
  visuals: string[];
  pageCount?: string;
  fileSize?: string;
  schemePages?: IpArchiveSchemePage[];
  evidencePoints?: string[];
  sourceTitle?: string;
  sourceUrl?: string;
  downloadUrl?: string;
  execution: string;
}

export interface IpArchive {
  id: string;
  platform: string;
  name: string;
  type: string;
  years: string;
  coverImage: string;
  thesis: string;
  authorNote: string;
  versions: IpArchiveVersion[];
}
