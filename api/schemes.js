export const config = {
  runtime: 'edge',
};

const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

async function redisGet(key) {
  try {
    const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
    });
    const data = await res.json();
    if (!data.result) return null;
    return JSON.parse(data.result);
  } catch (e) { return null; }
}

async function redisSet(key, value, ttl = 2700) {
  try {
    await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', key, JSON.stringify(value), 'EX', ttl])
    });
  } catch (e) { console.warn('Redis write failed:', e.message); }
}

const NOTION_BASE = 'https://api.notion.com/v1';

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = searchParams.get('db_id') || process.env.NOTION_DATABASE_ID;
  const cursor = searchParams.get('cursor');
  const category = searchParams.get('category') || '全部';
  const forceRefresh = searchParams.get('refresh') === 'true';

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return new Response(JSON.stringify({ error: 'Credentials missing' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cacheKey = `thinkppt-schemes-${NOTION_DATABASE_ID}-${category}-${cursor || 'first'}`;

  if (!forceRefresh) {
    const cached = await redisGet(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=2700, stale-while-revalidate=86400',
          'X-Cache': 'HIT'
        }
      });
    }
  }

  try {
    const notionHeaders = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    let categoryOptions = [];
    let categoryPropName = '';
    let featuredPropName = '';

    const dbRes = await fetch(`${NOTION_BASE}/databases/${NOTION_DATABASE_ID}`, {
      method: 'GET',
      headers: notionHeaders
    });

    if (dbRes.ok) {
      const dbData = await dbRes.json();
      const properties = dbData.properties || {};
      const candidateNames = ['Category', 'Class', 'Type', '分类', '类别'];
      const featuredNames = ['编辑推荐', 'Featured', 'featured', 'Editor Pick', '推荐', '精选'];

      for (const key in properties) {
        const prop = properties[key];
        if (!categoryPropName && prop.type === 'select' && (candidateNames.includes(key) || candidateNames.some(n => key.includes(n)))) {
          categoryPropName = key;
          categoryOptions = prop.select.options.map(o => o.name);
        }
        if (!featuredPropName && prop.type === 'checkbox' && featuredNames.includes(key)) {
          featuredPropName = key;
        }
      }
    }

    const sorts = [];
    if (featuredPropName) {
      sorts.push({ property: featuredPropName, direction: 'descending' });
    }
    sorts.push({ timestamp: 'last_edited_time', direction: 'descending' });

    const queryBody = {
      page_size: 100,
      start_cursor: cursor || undefined,
      sorts: sorts
    };

    if (category && category !== '全部' && categoryPropName) {
      queryBody.filter = { property: categoryPropName, select: { equals: category } };
    }

    const notionRes = await fetch(`${NOTION_BASE}/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify(queryBody),
    });

    const data = await notionRes.json();
    const rawPages = data.results || [];

    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
      try {
        const blocksRes = await fetch(`${NOTION_BASE}/blocks/${page.id}/children?page_size=5`, {
          method: 'GET',
          headers: notionHeaders
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
      } catch (e) {}
      return page;
    }));

    const responseData = {
      results: enrichedResults,
      next_cursor: data.next_cursor,
      has_more: data.has_more,
      categories: ['全部', ...categoryOptions]
    };

    await redisSet(cacheKey, responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=2700, stale-while-revalidate=86400',
        'X-Cache': 'MISS'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
