export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const NOTION_API_KEY = env.NOTION_API_KEY;

  if (!NOTION_API_KEY || !id) {
    return new Response(JSON.stringify({ error: 'Missing ID or API Key' }), { status: 400 });
  }

  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
  };

  const fetchChildren = async (blockId) => {
    try {
      const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, { headers });
      if (!res.ok) return [];
      const data = await res.json();
      const blocks = data.results || [];

      return await Promise.all(blocks.map(async (block) => {
        if (block.has_children && ['column_list', 'column', 'toggle'].includes(block.type)) {
          block.children = await fetchChildren(block.id);
        }
        return block;
      }));
    } catch (e) {
      return [];
    }
  };

  try {
    const results = await fetchChildren(id);
    return new Response(JSON.stringify({ results }), {
      headers: { 'content-type': 'application/json', 'Cache-Control': 'public, s-maxage=300' }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}