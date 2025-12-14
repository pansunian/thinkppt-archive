import { Scheme } from '../types';
import { PALETTE } from '../constants';

export const mapNotionResultToSchemes = (notionData: any): Scheme[] => {
  if (!notionData || !notionData.results) return [];

  return notionData.results.map((page: any, index: number) => {
    const props = page.properties;

    // Helper to safely get values from different Notion property types with fallback keys
    const getProp = (keys: string[]) => {
        // 1. Try finding by key name
        for (const key of keys) {
            if (props[key]) return props[key];
        }
        // 2. Fallback: If looking for title, search for any property of type 'title'
        if (keys.includes('Title')) {
            const titleKey = Object.keys(props).find(k => props[k].type === 'title');
            if (titleKey) return props[titleKey];
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

    // New: A robust getter that handles Select, Multi-Select (returns first item), and Text
    const getFlexibleString = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        
        // 1. Select
        if (prop.type === 'select') return prop.select?.name || '';
        
        // 2. Multi-Select (take first item)
        if (prop.type === 'multi_select') {
            return prop.multi_select?.[0]?.name || '';
        }
        
        // 3. Rich Text / Title
        if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';

        // 4. Number (Added support for numeric Year columns)
        if (prop.type === 'number') return prop.number !== null ? String(prop.number) : '';
        
        return '';
    };
    
    const getMultiSelect = (keys: string[]) => {
        const prop = getProp(keys);
        return prop?.multi_select?.map((item: any) => item.name) || [];
    }
    
    const getUrl = (keys: string[]) => {
        const prop = getProp(keys);
        let url = '';
        if (prop?.type === 'url') {
            url = prop.url || '';
        } else if (prop?.type === 'rich_text') {
            url = prop.rich_text?.[0]?.plain_text || ''; // Handle text URLs
        }

        if (!url) return '';

        url = url.trim();
        
        // Fix: If URL doesn't start with http/https, /, #, or mailto, prepend https://
        // This prevents browsers from treating "www.example.com" as relative path "current-domain/www.example.com"
        if (!/^(https?:\/\/|\/|#|mailto:)/i.test(url)) {
            return `https://${url}`;
        }

        return url;
    }

    const getDate = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        
        let dateStr = '';
        if (prop.type === 'date') {
            dateStr = prop.date?.start || ''; 
        } else if (prop.type === 'created_time') {
            dateStr = prop.created_time || '';
        } else if (prop.type === 'rich_text' || prop.type === 'title') {
             dateStr = prop.rich_text?.[0]?.plain_text || prop.title?.[0]?.plain_text || '';
        }

        // Format to YYYY-MM-DD if it contains time (ISO string)
        if (dateStr && dateStr.includes('T')) {
            return dateStr.split('T')[0];
        }
        return dateStr;
    };

    const getDisplayId = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';

        // Handle 'unique_id' type (Notion's auto-incrementing ID)
        if (prop.type === 'unique_id') {
            const { prefix, number } = prop.unique_id;
            return prefix ? `${prefix}-${number}` : String(number);
        }
        
        // Handle standard Number type
        if (prop.type === 'number') {
            return prop.number !== null ? String(prop.number) : '';
        }
        
        // Handle Rich Text or Title
        if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';

        // Handle Formula (if it returns string/number)
        if (prop.type === 'formula') {
             if (prop.formula.type === 'string') return prop.formula.string || '';
             if (prop.formula.type === 'number') return String(prop.formula.number);
        }

        return '';
    };

    // UPDATED PRIORITY: 
    // 1. First image found in content body (injected by backend)
    // 2. Native Page Cover
    // 3. Database "Files" property
    const getImage = (keys: string[]) => {
       // 1. Content Image (Fetched automatically from the first 5 blocks)
       if (page.first_content_image) {
           return page.first_content_image;
       }

       // 2. Check Native Page Cover
       if (page.cover) {
           if (page.cover.type === 'external') return page.cover.external.url;
           if (page.cover.type === 'file') return page.cover.file.url;
       }

       // 3. Check Database Properties
       const prop = getProp(keys);
       if (prop?.type === 'files' && prop.files.length > 0) {
           const file = prop.files[0];
           return file.type === 'file' ? file.file.url : file.external.url;
       }
       
       // 4. Fallback placeholder
       return 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80'; 
    };

    const defaultColor = PALETTE[index % PALETTE.length];
    
    // Resolve Date first so we can use it for Year fallback
    const dateStr = getDate(['创建时间', 'Date', 'Time', 'Created', '日期', '时间']) || new Date().toISOString().split('T')[0];
    
    // Resolve Year: 
    // 1. Explicit 'Year'/'年份' property (Text/Select/Number)
    // 2. If missing, extract from dateStr (YYYY)
    // 3. Fallback to '2025'
    let yearStr = getFlexibleString(['Year', '年份']);
    if (!yearStr && dateStr) {
        yearStr = dateStr.split('-')[0];
    }
    if (!yearStr) yearStr = '2025';

    // UPDATED: key lookups to include User provided names like "网站标题", "网址"
    return {
      id: page.id,
      // Added '网站标题' and 'title' (lowercase)
      title: getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '无标题',
      category: getFlexibleString(['Category', 'Class', 'Type', '分类', '类别']) || '未分类',
      
      // Updated to use getFlexibleString to handle Multi-select/Text column types
      brand: getFlexibleString(['Brand', 'Client', '品牌', '客户']) || 'ThinkPPT',    
      industry: getFlexibleString(['Industry', 'Sector', '行业']) || '通用',   
      year: yearStr,           
      
      // Added '网址'
      downloadUrl: getUrl(['Download', 'Link', 'URL', '下载链接', '网址']),             
      date: dateStr,
      
      // NEW: Map specific 'ID' property to displayId. Fallback to sliced UUID if not found.
      // Prioritize Notion's unique_id system or explicit 'ID' columns
      displayId: getDisplayId(['ID', 'ID 属性', 'Code', '编号', 'No', 'Number']) || page.id.slice(-4).toUpperCase(),
      
      description: getText(['Description', 'Summary', 'Intro', '描述', '简介']),
      tags: getMultiSelect(['Tags', 'Keywords', '标签']),
      color: getText(['Color', 'Hex', 'Theme', '颜色']) || defaultColor,
      imageUrl: getImage(['Image', 'Cover', 'Photo', '图片', '封面']),
    };
  });
};