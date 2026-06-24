import { Scheme } from '../types';
import { PALETTE } from '../constants';

const KNOWN_IP_PATTERNS = [
  '慢人节',
  '雪人节',
  '外人节',
  '马路生活节',
  '夜人节',
  '闪光青春派',
  '闪光开学季',
  '遛遛生活',
  '我就要这样生活',
  '过年就来小红书',
  '新年小红大集',
  '大家运动周',
  '溯源看世界',
  '万物有时节',
  '神奇国货在哪里',
  '潮流奶爸在哪里',
  '红薯旅行社',
  '专薯日',
  '气味飞行计划',
  '每日美食日历',
  '拜年纪',
  '百大UP主盛典',
  '毕业季',
  '考试季',
  '高考季',
  '开学季',
  '校园IP生活B修课',
  '中秋晚会',
  '有求B应',
  'B无忧好物集',
  'CNY',
  '马年星晚',
  '冰雪季',
  '校运会',
  '节气文化',
  '团圆进行时',
  '上班搭子',
  '城市漫游',
  '天空之下音乐会',
  '风从东方来',
];

const inferIpName = (title: string, platform: string) => {
  const cleanTitle = title.replace(/\s+/g, '');
  const matched = KNOWN_IP_PATTERNS.find(pattern => cleanTitle.includes(pattern.replace(/\s+/g, '')));
  if (matched) {
    if (matched === 'CNY' || matched === '马年星晚' || matched === '团圆进行时') return `${platform || '平台'}春节 IP`;
    if (matched === '闪光开学季') return '闪光青春派';
    return matched;
  }

  const generic = cleanTitle
    .replace(/20\\d{2}/g, '')
    .replace(new RegExp(platform || '$^', 'g'), '')
    .replace(/[《》【】「」\\[\\]（）()·：:—\\-_]/g, '')
    .replace(/招商项目|招商方案|招商通案|营销通案|项目通案|合作方案|设计方案|企划|方案|通案|营销IP|IP通案|IP/g, '')
    .trim();

  return generic ? `${generic.slice(0, 12)} IP` : title;
};

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
       const preferredImage = getUrl(['封面图OSS', 'Cover OSS', 'Image URL', 'Cover URL']);
       if (preferredImage) return preferredImage;
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
    const annualTheme = getText(['年度主题', 'Theme Slogan', '主题Slogan', '主题 Slogan', '活动主题', '主题']) || '';
    const pdfOssUrl = getUrl(['PDF原件OSS', 'PDF OSS', 'PDF原件', 'PDF下载']);

    return {
      id: page.id,
      title: getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '无标题',
      category,
      brand: getFlexibleString(['Brand', 'Client', '品牌', '客户']) || 'ThinkPPT',    
      industry: getFlexibleString(['Industry', 'Sector', '行业']) || '通用',   
      year: yearStr,           
      downloadUrl: getUrl(['Download', 'Link', 'URL', '下载链接', '网址']) || pdfOssUrl,
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
      ipName: ipName || getFlexibleString(['Series', 'Collection', '专题', '系列']) || inferIpName(getText(['Title', 'Name', 'Page', '标题', '方案名称', '网站标题', 'title']) || '', platform),
      projectType,
      archiveType,
      ipStage: getFlexibleString(['IP Stage', '持续年限', '第几年', 'IP阶段', '运营年限']) || '',
      slogan: getText(['Slogan', 'Theme Slogan', '主题Slogan', '主题 Slogan', '活动主题', '年度主题', '主题']) || '',
      ipPosition: getText(['IP定位', 'IP Position', 'IP Definition', '定位']) || '',
      schemeRole: getFlexibleString(['方案角色', 'Scheme Role', 'Project Role', '角色']) || '',
      annualTheme,
      coreInsight: getText(['核心洞察', 'Insight', '洞察', '用户洞察']) || '',
      bigIdea: getText(['Big Idea', 'Big Idea一句话', '创意主张', '核心主张']) || '',
      schemeNarrative: getText(['方案脉络', 'Narrative', '整体脉络', '方案结构']) || '',
      curationSummary: getText(['策展摘要', 'Curator Summary', '站长摘要', '策展说明']) || '',
      featuredPageNumbers: getText(['精选页码', 'Featured Pages', '推荐页码']) || '',
      featuredPageTitles: getText(['精选页标题', 'Featured Page Titles', '推荐页标题']) || '',
      featuredPageNotes: getText(['精选页说明', 'Featured Page Notes', '推荐页说明']) || '',
      pdfOssUrl,
      pageImagesOssPrefix: getUrl(['页面图OSS目录', 'Page Images OSS', '页面图目录', '页面图OSS']) || '',
      coverOssUrl: getUrl(['封面图OSS', 'Cover OSS', '封面OSS']) || '',
      readingStatus: getFlexibleString(['阅读状态', 'Reading Status', '整理状态', '上线状态']) || '',
      editorNote: editorNote || getText(['策展摘要', 'Description', 'Summary', 'Intro', '描述', '简介']),
      keyChange: getText(['Key Change', '关键变化', '年度变化', '变化观察', '变化']) || '',
      partners: getList(['Partners', 'Co Brands', '合作品牌', '参与品牌', '品牌伙伴']),
      rights: getList(['Rights', 'Benefits', '权益', '招商权益', '核心权益', '资源权益']),
      resultSummary: getText(['Results', 'Effect', '执行效果', '传播效果', '效果摘要', '战报']) || '',
    };
  });
};
