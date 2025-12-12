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
}

export interface GeneratedOutline {
  title: string;
  sections: string[];
}