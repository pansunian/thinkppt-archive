
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = searchParams.get('db_id') || process.env.NOTION_DATABASE_ID;
  const cursor = searchParams.get('cursor');
  const category = searchParams.get('category');
  const forceRefresh = searchParams.get('refresh') === 'true';

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return new Response(JSON.stringify({ error: 'Credentials missing' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 1. 获取数据库元数据
    let categoryOptions = [];
    let categoryPropName = '';
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
    });
    
    if (dbRes.ok) {
      const dbData = await dbRes.json();
      const properties = dbData.properties || {};
      const candidateNames = ['Category', 'Class', 'Type', '分类', '类别'];
      for (const key in properties) {
        if (properties[key].type === 'select' && (candidateNames.includes(key) || candidateNames.some(n => key.includes(n)))) {
          categoryPropName = key;
          categoryOptions = properties[key].select.options.map(o => o.name);
          break;
        }
      }
    }

    // 2. 查询内容
    const queryBody = {
      page_size: 48,
      start_cursor: cursor || undefined,
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }]
    };

    if (category && category !== '全部' && categoryPropName) {
      queryBody.filter = { property: categoryPropName, select: { equals: category } };
    }

    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(queryBody),
    });

    const data = await notionRes.json();
    const rawPages = data.results || [];

    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
      try {
        const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=5`, {
          method: 'GET', headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
        });
        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          const imageBlock = blocksData.results.find(b => b.type === 'image');
          if (imageBlock) {
            const imageUrl = imageBlock.image.type === 'file' ? imageBlock.image.file.url : imageBlock.image.external.url;
            return { ...page, first_content_image: imageUrl };
          }
        }
      } catch (e) {}
      return page;
    }));

    // 如果强制刷新，设置 Cache-Control 为 no-cache，否则设置为长效缓存
    const cacheHeader = forceRefresh 
      ? 'no-store, max-age=0' 
      : 'public, s-maxage=2592000, stale-while-revalidate=86400';

    return new Response(JSON.stringify({
      results: enrichedResults,
      next_cursor: data.next_cursor,
      has_more: data.has_more,
      categories: ['全部', ...categoryOptions]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
