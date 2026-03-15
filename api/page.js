export const config = {
  runtime: 'edge',
};

const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;
const NOTION_BASE = 'https://api.notion.com/v1';

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

async function redisSet(key, value, ttl = 1500) {
  try {
    await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', key, JSON.stringify(value), 'EX', ttl])
    });
  } catch (e) {}
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const forceRefresh = searchParams.get('refresh') === 'true';
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY || !id) {
    return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });
  }

  const cacheKey = `thinkppt-page-${id}`;

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
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28'
    };

    const pageRes = await fetch(`${NOTION_BASE}/pages/${id}`, { method: 'GET', headers });
    if (!pageRes.ok) return new Response(null, { status: pageRes.status });

    const pageData = await pageRes.json();
    let enrichedPage = pageData;

    const blocksRes = await fetch(`${NOTION_BASE}/blocks/${id}/children?page_size=5`, { method: 'GET', headers });
    if (blocksRes.ok) {
      const blocksData = await blocksRes.json();
      const imageBlock = blocksData.results.find(b => b.type === 'image');
      if (imageBlock) {
        const imageUrl = imageBlock.image.type === 'file'
          ? imageBlock.image.file.url
          : imageBlock.image.external.url;
        enrichedPage = { ...pageData, first_content_image: imageUrl };
      }
    }

    await redisSet(cacheKey, enrichedPage);

    return new Response(JSON.stringify(enrichedPage), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=2700, stale-while-revalidate=86400',
        'X-Cache': 'MISS'
      },
    });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
