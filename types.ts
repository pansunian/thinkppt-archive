
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
}

export interface GeneratedOutline {
  title: string;
  sections: string[];
}