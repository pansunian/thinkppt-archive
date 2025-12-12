export default async function handler(request, response) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  // 1. Check Credentials
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return response.status(401).json({ 
      error: 'Notion credentials missing in Vercel Environment Variables.' 
    });
  }

  try {
    // 2. Fetch Database List
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 50, // Limit to 50 for performance since we are doing sub-requests
      }),
    });

    if (!notionRes.ok) {
      const errorDetails = await notionRes.text();
      console.error('Notion API Error:', errorDetails);
      return response.status(notionRes.status).json({ 
        error: 'Notion API Error', 
        details: errorDetails 
      });
    }

    const data = await notionRes.json();

    // 3. ENRICHMENT STEP: Fetch first content block for each page to find an image
    // Note: This does N+1 requests. We use Promise.all to do it in parallel.
    // We limit page_size to 5 blocks to minimize payload size and latency.
    const enrichedResults = await Promise.all(data.results.map(async (page) => {
        try {
            // Only fetch blocks if we don't already have a native cover (optional optimization, 
            // but user requested to use content image, so we try to fetch it).
            
            const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=5`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                },
            });

            if (blocksRes.ok) {
                const blocksData = await blocksRes.json();
                // Find the first block that is of type 'image'
                const imageBlock = blocksData.results.find(b => b.type === 'image');
                
                if (imageBlock) {
                    const imageUrl = imageBlock.image.type === 'file' 
                        ? imageBlock.image.file.url 
                        : imageBlock.image.external.url;
                    
                    // Inject this new property into the page object
                    return { ...page, first_content_image: imageUrl };
                }
            }
        } catch (error) {
            console.error(`Failed to fetch blocks for page ${page.id}`, error);
        }
        
        return page; // Return original page if fetch fails or no image found
    }));

    // Update data results with the enriched versions
    data.results = enrichedResults;
    
    // 4. Success
    return response.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}