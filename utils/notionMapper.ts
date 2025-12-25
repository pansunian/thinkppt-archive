import { Scheme } from '../types';
import { PALETTE } from '../constants';

export const mapNotionResultToSchemes = (notionData: any): Scheme[] => {
  if (!notionData || !notionData.results) return [];

  return notionData.results.map((page: any, index: number) => {
    const props = page.properties;

    const getProp = (keys: string[]) => {
        // 先尝试精准匹配
        for (const key of keys) {
            if (props[key]) return props[key];
        }
        // 再尝试模糊匹配（不区分大小写和空格）
        const allKeys = Object.keys(props);
        for (const key of keys) {
            const found = allKeys.find(k => k.toLowerCase().replace(/\s/g, '') === key.toLowerCase().replace(/\s/g, ''));
            if (found) return props[found];
        }
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

    const getFlexibleString = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        if (prop.type === 'select') return prop.select?.name || '';
        if (prop.type === 'multi_select') return prop.multi_select?.[0]?.name || '';
        if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
        if (prop.type === 'number') return prop.number !== null ? String(prop.number) : '';
        if (prop.type === 'formula') {
            if (prop.formula.type === 'string') return prop.formula.string || '';
            if (prop.formula.type === 'number') return prop.formula.number !== null ? String(prop.formula.number) : '';
        }
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
            url = prop.rich_text?.[0]?.plain_text || '';
        }
        if (!url) return '';
        url = url.trim();
        if (!/^(https?:\/\/|\/|#|mailto:)/i.test(url)) {
            return `https://${url}`;
        }
        return url;
    }

    const getDate = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        let dateStr = '';
        if (prop.type === 'date') dateStr = prop.date?.start || ''; 
        else if (prop.type === 'created_time') dateStr = prop.created_time || '';
        else if (prop.type === 'rich_text' || prop.type === 'title') {
             dateStr = prop.rich_text?.[0]?.plain_text || prop.title?.[0]?.plain_text || '';
        }
        if (dateStr && dateStr.includes('T')) return dateStr.split('T')[0];
        return dateStr;
    };

    const getDisplayId = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return '';
        if (prop.type === 'unique_id') {
            const { prefix, number } = prop.unique_id;
            return prefix ? `${prefix}-${number}` : String(number);
        }
        if (prop.type === 'number') return prop.number !== null ? String(prop.number) : '';
        if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
        if (prop.type === 'formula') {
             if (prop.formula.type === 'string') return prop.formula.string || '';
             if (prop.formula.type === 'number') return String(prop.formula.number);
        }
        return '';
    };

    const getImage = (keys: string[]) => {
       if (page.first_content_image) return page.first_content_image;
       if (page.cover) {
           if (page.cover.type === 'external') return page.cover.external.url;
           if (page.cover.type === 'file') return page.cover.file.url;
       }
       const prop = getProp(keys);
       if (prop?.type === 'files' && prop.files.length > 0) {
           const file = prop.files[0];
           return file.type === 'file' ? file.file.url : file.external.url;
       }
       return 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80'; 
    };

    const paletteColors = Object.values(PALETTE);
    const defaultColor = paletteColors[index % paletteColors.length];
    
    const dateStr = getDate(['创建时间', 'Date', 'Time', 'Created', '日期', '时间']) || new Date().toISOString().split('T')[0];
    
    let yearStr = getFlexibleString(['Year', '年份']);
    if (!yearStr && dateStr) yearStr = dateStr.split('-')[0];
    if (!yearStr) yearStr = '2025';

    return {
      id: page.id,
      title: getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '无标题',
      category: getFlexibleString(['Category', 'Class', 'Type', '分类', '类别']) || '未分类',
      brand: getFlexibleString(['Brand', 'Client', '品牌', '客户']) || 'ThinkPPT',    
      industry: getFlexibleString(['Industry', 'Sector', '行业']) || '通用',   
      year: yearStr,           
      downloadUrl: getUrl(['Download', 'Link', 'URL', '下载链接', '网址']),             
      date: dateStr,
      displayId: getDisplayId(['ID', 'ID 属性', 'Code', '编号', 'No', 'Number']) || page.id.slice(-4).toUpperCase(),
      description: getText(['Description', 'Summary', 'Intro', '描述', '简介']),
      tags: getMultiSelect(['Tags', 'Keywords', '标签']),
      color: getText(['Color', 'Hex', 'Theme', '颜色']) || defaultColor,
      imageUrl: getImage(['Image', 'Cover', 'Photo', '图片', '封面']),
      // 扩展了文件大小和页数的属性匹配名
      fileSize: getFlexibleString(['Size', '大小', '文件大小', 'FileSize', '文件容量']) || '',
      pageCount: getFlexibleString(['Pages', '页数', '方案页数', 'PageCount', '文件页数', '页码']) || '',
    };
  });
};