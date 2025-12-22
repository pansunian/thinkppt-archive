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

    // 1. Fetch Categories
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

    // 2. Query Data
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
    
    return new Response(JSON.stringify({
      results: data.results,
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