export default async function handler(request, response) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  const { cursor } = request.query; // Get cursor from frontend

  // 1. Check Credentials
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return response.status(401).json({ 
      error: 'Notion credentials missing in Vercel Environment Variables.' 
    });
  }

  try {
    // 2. Fetch Database Pages (Paginated)
    // We fetch 50 items as requested.
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 50, // Load 50 items per page
        start_cursor: cursor || undefined, // Use cursor if provided
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
    const rawPages = data.results;
    
    // 3. ENRICHMENT STEP: Fetch first content block for each page to find an image
    // Using Promise.all for the batch of 50
    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
        try {
            // We fetch the first 5 blocks to look for an image
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
        
        return page; 
    }));
    
    // 4. Return results with pagination info
    return response.status(200).json({ 
        results: enrichedResults,
        next_cursor: data.next_cursor,
        has_more: data.has_more
    });

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}