import { Scheme } from '../types';
import { PALETTE } from '../constants';

export const mapNotionResultToSchemes = (notionData: any): Scheme[] => {
  if (!notionData || !notionData.results) return [];

  return notionData.results.map((page: any, index: number) => {
    const props = page.properties;

    // Helper to safely get values from different Notion property types with fallback keys
    // Example: try getting 'Title', if not found, try 'Name', then 'Page'
    const getProp = (keys: string[]) => {
        for (const key of keys) {
            if (props[key]) return props[key];
        }
        return null;
    };

    const getText = (keys: string[]) => {
      const prop = getProp(keys);
      if (!prop) return '';
      if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
      if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
      return '';
    };

    const getSelect = (keys: string[]) => {
        const prop = getProp(keys);
        return prop?.select?.name || '';
    }
    
    const getMultiSelect = (keys: string[]) => {
        const prop = getProp(keys);
        return prop?.multi_select?.map((item: any) => item.name) || [];
    }
    
    const getUrl = (keys: string[]) => {
        const prop = getProp(keys);
        return prop?.url || '';
    }

    // NEW: Handle Notion Date Property
    const getDate = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        if (prop.type === 'date') {
            return prop.date?.start || ''; // Returns YYYY-MM-DD
        }
        // Fallback if user hasn't changed the column type yet
        if (prop.type === 'rich_text' || prop.type === 'title') {
             return prop.rich_text?.[0]?.plain_text || prop.title?.[0]?.plain_text || '';
        }
        return '';
    };

    // For images, we support both File uploads (expiring URLs) and External Links
    const getImage = (keys: string[]) => {
       const prop = getProp(keys);
       if (prop?.type === 'files' && prop.files.length > 0) {
           const file = prop.files[0];
           return file.type === 'file' ? file.file.url : file.external.url;
       }
       // Fallback placeholder
       return 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80'; 
    };

    // Assign a default color from palette based on index if no color provided in Notion
    const defaultColor = PALETTE[index % PALETTE.length];

    // Mapping with fallbacks for common Notion column names
    return {
      id: page.id,
      title: getText(['Title', 'Name', 'Page', '标题', '方案名称']) || '无标题方案',
      category: getSelect(['Category', 'Class', 'Type', '分类', '类别']) || '未分类',
      brand: getSelect(['Brand', 'Client', '品牌', '客户']) || 'ThinkPPT',    
      industry: getSelect(['Industry', 'Sector', '行业']) || '通用',   
      year: getSelect(['Year', 'Date', '年份']) || '2025',           
      downloadUrl: getUrl(['Download', 'Link', 'URL', '下载链接']),             
      date: getDate(['Date', 'Time', 'Created', '日期', '时间']) || new Date().toISOString().split('T')[0],
      description: getText(['Description', 'Summary', 'Intro', '描述', '简介']),
      tags: getMultiSelect(['Tags', 'Keywords', '标签']),
      color: getText(['Color', 'Hex', 'Theme', '颜色']) || defaultColor,
      imageUrl: getImage(['Image', 'Cover', 'Photo', '图片', '封面']),
    };
  });
};