export default async function handler(request, response) {
  const { id } = request.query;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY) {
    return response.status(401).json({ error: 'Notion API Key missing' });
  }

  if (!id) {
    return response.status(400).json({ error: 'Missing page ID' });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    };

    // 1. Fetch the Page Properties
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'GET',
      headers: headers,
    });

    if (!pageRes.ok) {
        const err = await pageRes.text();
        return response.status(pageRes.status).json({ error: err });
    }

    const pageData = await pageRes.json();

    // 2. ENRICHMENT: Fetch first block for image if needed (Same logic as schemes.js)
    let enrichedPage = pageData;
    
    try {
        const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=5`, {
            method: 'GET',
            headers: headers,
        });

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
    } catch (error) {
        console.warn(`Failed to enrich page ${id}`, error);
    }

    // Return as a single item, logic similar to schemes list
    return response.status(200).json(enrichedPage);

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}