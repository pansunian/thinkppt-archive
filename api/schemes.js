export default async function handler(request, response) {
  // --- PERFORMANCE OPTIMIZATION FOR CHINA ---
  // Increase cache to 1 hour (3600s), serve stale for up to 1 day (86400s)
  // This drastically reduces latency for users in China by serving from Vercel Edge.
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = request.query.db_id || process.env.NOTION_DATABASE_ID;
  const { cursor, category } = request.query; 

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return response.status(401).json({ error: 'Notion credentials missing.' });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 1. Fetch Database Metadata (Optimized: No extra enrichment)
    let categoryOptions = [];
    let categoryPropName = '';

    try {
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
        });
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
    } catch (e) {
        console.warn("Category fetch failed", e);
    }

    // 2. Query Database (Optimized: Removed image block enrichment)
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

    if (!notionRes.ok) {
      return response.status(notionRes.status).json({ error: 'Notion API Error' });
    }

    const data = await notionRes.json();
    
    // NOTE: We no longer iterate through every page to fetch blocks.
    // This reduces the response time from ~10s to ~500ms.
    // Users should use "Cover" or an "Image" property in Notion for previews.
    
    return response.status(200).json({ 
        results: data.results,
        next_cursor: data.next_cursor,
        has_more: data.has_more,
        categories: ['全部', ...categoryOptions]
    });

  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}