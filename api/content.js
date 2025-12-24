
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY || !id) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
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
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=86400', // 详情内容缓存更久
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500 });
  }
}
