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
    let allPages = [];
    let hasMore = true;
    let cursor = undefined;

    // 2. Fetch ALL Database Pages (Pagination Loop)
    // Notion API limits to 100 items per request. We loop until has_more is false.
    while (hasMore) {
        const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_size: 100, // Maximize page size
            start_cursor: cursor, // Pass the cursor for the next page
          }),
        });

        if (!notionRes.ok) {
          const errorDetails = await notionRes.text();
          console.error('Notion API Error:', errorDetails);
          // If the first request fails, return error. If subsequent fails, we might just return what we have? 
          // Better to fail loudly for debugging.
          return response.status(notionRes.status).json({ 
            error: 'Notion API Error', 
            details: errorDetails 
          });
        }

        const data = await notionRes.json();
        allPages = [...allPages, ...data.results];
        
        hasMore = data.has_more;
        cursor = data.next_cursor;
    }

    // 3. ENRICHMENT STEP: Fetch first content block for each page to find an image
    // With 100+ items, processing all at once might hit Notion Rate Limits (429) or Vercel Timeouts.
    // However, usually Promise.all handles ~100 requests fine if Notion is responsive.
    const enrichedResults = await Promise.all(allPages.map(async (page) => {
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
    
    // 4. Return combined results
    // We wrap it in a structure compatible with the frontend expectation { results: [...] }
    return response.status(200).json({ results: enrichedResults });

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}