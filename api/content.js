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

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const forceRefresh = searchParams.get('refresh') === 'true';
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY || !id) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  // 先读 Redis 缓存
  if (!forceRefresh) {
    const cached = await redisGet(`thinkppt-content-${id}`);
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

  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
  };

  const fetchChildrenRecursively = async (blockId) => {
    try {
      const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
        method: 'GET',
        headers: headers,
      });
      if (!res.ok) return [];
      const data = await res.json();
      const blocks = data.results || [];
      return await Promise.all(blocks.map(async (block) => {
        if (block.has_children && ['column_list', 'column', 'toggle'].includes(block.type)) {
          block.children = await fetchChildrenRecursively(block.id);
        }
        return block;
      }));
    } catch (e) { return []; }
  };

  try {
    const results = await fetchChildrenRecursively(id);
    const responseData = { results };

    // 写入 Redis 缓存
    await redisSet(`thinkppt-content-${id}`, responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=2700, stale-while-revalidate=86400',
        'X-Cache': 'MISS'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
  }
}
