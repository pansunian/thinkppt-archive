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
      if (prop.type === 'title') return prop.title?.map((item: any) => item.plain_text).join('') || '';
      if (prop.type === 'rich_text') return prop.rich_text?.map((item: any) => item.plain_text).join('') || '';
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

    const getList = (keys: string[]) => {
        const prop = getProp(keys);
        if (!prop) return [];
        if (prop.type === 'multi_select') return prop.multi_select?.map((item: any) => item.name).filter(Boolean) || [];
        if (prop.type === 'select') return prop.select?.name ? [prop.select.name] : [];
        if (prop.type === 'rich_text') {
            const text = prop.rich_text?.map((item: any) => item.plain_text).join('') || '';
            return text.split(/[、,，;；\n]/).map((item: string) => item.trim()).filter(Boolean);
        }
        if (prop.type === 'title') {
            const text = prop.title?.map((item: any) => item.plain_text).join('') || '';
            return text.split(/[、,，;；\n]/).map((item: string) => item.trim()).filter(Boolean);
        }
        return [];
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

    // Helper to get checkbox value
    const getCheckbox = (keys: string[]) => {
        const prop = getProp(keys);
        return prop?.type === 'checkbox' ? prop.checkbox : false;
    };

    const paletteColors = Object.values(PALETTE);
    const defaultColor = paletteColors[index % paletteColors.length];
    
    const dateStr = getDate(['创建时间', 'Date', 'Time', 'Created', '日期', '时间']) || new Date().toISOString().split('T')[0];
    
    let yearStr = getFlexibleString(['Year', '年份']);
    if (!yearStr && dateStr) yearStr = dateStr.split('-')[0];
    if (!yearStr) yearStr = '2025';

    const category = getFlexibleString(['Category', 'Class', 'Type', '分类', '类别']) || '未分类';
    const platform = getFlexibleString(['Platform', '平台', '所属平台', '渠道平台']) || '';
    const ipName = getFlexibleString(['IP', 'IP Name', 'IP名称', 'IP项目', '项目IP', '栏目IP']) || '';
    const projectType = getFlexibleString(['Project Type', '项目类型', '项目类别', '方案类型']) || category;
    const archiveType = getFlexibleString(['Archive Type', '档案类型', '资料类型', '文件类型', '物料类型']) || projectType;
    const editorNote = getText(['Editor Note', "Editor's Note", '站长观察', '编辑观察', '观察', 'AI摘要', 'AI 摘要', '摘要']);

    return {
      id: page.id,
      title: getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '无标题',
      category,
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
      fileSize: getFlexibleString(['Size', '大小', '文件大小', 'FileSize', '文件容量']) || '',
      pageCount: getFlexibleString(['Pages', '页数', '方案页数', 'PageCount', '文件页数', '页码']) || '',
      // Map '编辑推荐' checkbox
      isFeatured: getCheckbox(['编辑推荐', 'Featured', 'Editor Pick', '推荐', '精选']),
      platform: platform || getFlexibleString(['Brand', 'Client', '品牌', '客户']) || '未标注平台',
      ipName: ipName || getFlexibleString(['Series', 'Collection', '专题', '系列']) || getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '未命名 IP',
      projectType,
      archiveType,
      ipStage: getFlexibleString(['IP Stage', '持续年限', '第几年', 'IP阶段', '运营年限']) || '',
      slogan: getText(['Slogan', 'Theme Slogan', '主题Slogan', '主题 Slogan', '活动主题', '年度主题', '主题']) || '',
      editorNote: editorNote || getText(['Description', 'Summary', 'Intro', '描述', '简介']),
      keyChange: getText(['Key Change', '关键变化', '年度变化', '变化观察', '变化']) || '',
      partners: getList(['Partners', 'Co Brands', '合作品牌', '参与品牌', '品牌伙伴']),
      rights: getList(['Rights', 'Benefits', '权益', '招商权益', '核心权益', '资源权益']),
      resultSummary: getText(['Results', 'Effect', '执行效果', '传播效果', '效果摘要', '战报']) || '',
    };
  });
};
