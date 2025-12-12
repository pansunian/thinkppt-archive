import { Scheme } from '../types';

export const mapNotionResultToSchemes = (notionData: any): Scheme[] => {
  if (!notionData || !notionData.results) return [];

  return notionData.results.map((page: any) => {
    const props = page.properties;

    // Helper to safely get values from different Notion property types
    const getText = (prop: any) => {
      if (!prop) return '';
      if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
      if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
      return '';
    };

    const getSelect = (prop: any) => prop?.select?.name || '';
    const getMultiSelect = (prop: any) => prop?.multi_select?.map((item: any) => item.name) || [];
    const getUrl = (prop: any) => prop?.url || '';

    // NEW: Handle Notion Date Property
    const getDate = (prop: any) => {
        if (!prop) return '';
        if (prop.type === 'date') {
            return prop.date?.start || ''; // Returns YYYY-MM-DD
        }
        // Fallback if user hasn't changed the column type yet
        return getText(prop);
    };

    // For images, we support both File uploads (expiring URLs) and External Links
    const getImage = (prop: any) => {
       if (prop?.type === 'files' && prop.files.length > 0) {
           const file = prop.files[0];
           return file.type === 'file' ? file.file.url : file.external.url;
       }
       // Fallback placeholder
       return 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80'; 
    };

    return {
      id: page.id,
      title: getText(props['Title']) || '无标题方案',
      category: getSelect(props['Category']) || '未分类',
      brand: getSelect(props['Brand']) || 'THINK_PPT',    
      industry: getSelect(props['Industry']) || '通用',   
      year: getSelect(props['Year']) || '2025',           
      downloadUrl: getUrl(props['Download']),             
      date: getDate(props['Date']) || new Date().toISOString().split('T')[0], // Updated to use specific Date handler
      description: getText(props['Description']),
      tags: getMultiSelect(props['Tags']),
      color: getText(props['Color']) || '#FFC8DD',
      imageUrl: getImage(props['Image']),
    };
  });
};