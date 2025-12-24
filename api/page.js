
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY || !id) {
    return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });
  }

  try {
    const headers = { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' };
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${id}`, { method: 'GET', headers });
    if (!pageRes.ok) return new Response(null, { status: pageRes.status });
    
    const pageData = await pageRes.json();
    let enrichedPage = pageData;
    
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=5`, { method: 'GET', headers });
    if (blocksRes.ok) {
      const blocksData = await blocksRes.json();
      const imageBlock = blocksData.results.find(b => b.type === 'image');
      if (imageBlock) {
        const imageUrl = imageBlock.image.type === 'file' ? imageBlock.image.file.url : imageBlock.image.external.url;
        enrichedPage = { ...pageData, first_content_image: imageUrl };
      }
    }

    return new Response(JSON.stringify(enrichedPage), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
