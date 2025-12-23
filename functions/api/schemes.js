export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const NOTION_API_KEY = env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = url.searchParams.get('db_id') || env.NOTION_DATABASE_ID;
  const cursor = url.searchParams.get('cursor');
  const category = url.searchParams.get('category');

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return new Response(JSON.stringify({ error: 'Notion credentials missing.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 1. 获取分类选项
    let categoryOptions = [];
    let categoryPropName = '';
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, { headers });
    if (dbRes.ok) {
      const dbData = await dbRes.json();
      const properties = dbData.properties || {};
      const candidateNames = ['Category', 'Class', 'Type', '分类', '类别'];
      for (const key in properties) {
        if (properties[key].type === 'select' && candidateNames.includes(key)) {
          categoryPropName = key;
          categoryOptions = properties[key].select.options.map(o => o.name);
          break;
        }
      }
    }

    // 2. 查询页面
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
      headers,
      body: JSON.stringify(queryBody),
    });

    if (!notionRes.ok) {
      return new Response(await notionRes.text(), { status: notionRes.status });
    }

    const data = await notionRes.json();
    const rawPages = data.results;

    // 3. 图片富化逻辑
    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
      try {
        const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=20`, {
          method: 'GET',
          headers,
        });

        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          const imageBlock = blocksData.results.find(b => b.type === 'image');
          if (imageBlock) {
            const imageUrl = imageBlock.image.type === 'file' 
              ? imageBlock.image.file.url 
              : imageBlock.image.external.url;
            return { ...page, first_content_image: imageUrl };
          }
        }
      } catch (error) {
        console.error(`Failed to fetch blocks for page ${page.id}`, error);
      }
      return page; 
    }));
    
    return new Response(JSON.stringify({
      results: enrichedResults,
      next_cursor: data.next_cursor,
      has_more: data.has_more,
      categories: ['全部', ...categoryOptions]
    }), {
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}