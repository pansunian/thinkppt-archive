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

  try {
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${id}`, { headers });
    if (!pageRes.ok) return new Response(await pageRes.text(), { status: pageRes.status });
    
    const pageData = await pageRes.json();
    
    // Optional: Fetch first block for image
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=5`, { headers });
    if (blocksRes.ok) {
      const blocksData = await blocksRes.json();
      const imageBlock = blocksData.results.find(b => b.type === 'image');
      if (imageBlock) {
        const imageUrl = imageBlock.image.type === 'file' ? imageBlock.image.file.url : imageBlock.image.external.url;
        pageData.first_content_image = imageUrl;
      }
    }

    return new Response(JSON.stringify(pageData), {
      headers: { 'content-type': 'application/json', 'Cache-Control': 'public, s-maxage=60' }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}