export default async function handler(request, response) {
  // 核心优化：延长缓存。s-maxage 让 Vercel 边缘节点缓存内容，stale-while-revalidate 让后台异步更新
  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = request.query.db_id || process.env.NOTION_DATABASE_ID;
  const { cursor, category } = request.query; 

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return response.status(401).json({ error: 'Credentials missing' });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 1. 并发获取数据库信息和查询内容
    const [dbMetadataRes, queryRes] = await Promise.all([
      fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, { method: 'GET', headers }),
      fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          page_size: 24, // 减小单页数量至 24，提升首屏响应速度
          start_cursor: cursor || undefined,
          sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
          filter: (category && category !== '全部') ? {
            property: '分类', // 假设属性名固定或通过元数据动态匹配
            select: { equals: category }
          } : undefined
        }),
      })
    ]);

    if (!queryRes.ok) throw new Error('Notion Query Failed');
    
    const dbData = dbMetadataRes.ok ? await dbMetadataRes.json() : {};
    const queryData = await queryRes.json();
    const rawPages = queryData.results;

    // 2. 智能图片处理：避免 N+1
    // 只有当页面既没有封面，也没有 Files 属性图时，才去查第一个 Block
    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
      // 检查是否有原生封面或文件属性
      const hasNativeImage = page.cover || 
                            (page.properties.Image?.files?.length > 0) || 
                            (page.properties.图片?.files?.length > 0);
      
      if (hasNativeImage) return page;

      // 只有极少数情况才查 Block，且限制只查前几条以保速
      try {
        const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=3`, {
          method: 'GET',
          headers,
        });
        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          const imageBlock = blocksData.results.find(b => b.type === 'image');
          if (imageBlock) {
            page.first_content_image = imageBlock.image.type === 'file' 
              ? imageBlock.image.file.url 
              : imageBlock.image.external.url;
          }
        }
      } catch (e) {}
      return page;
    }));

    const categoryOptions = dbData.properties?.['分类']?.select?.options?.map(o => o.name) || 
                           dbData.properties?.['Category']?.select?.options?.map(o => o.name) || [];

    return response.status(200).json({ 
        results: enrichedResults,
        next_cursor: queryData.next_cursor,
        has_more: queryData.has_more,
        categories: ['全部', ...categoryOptions]
    });

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}