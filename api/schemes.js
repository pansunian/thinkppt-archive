export default async function handler(request, response) {
  // --- PERFORMANCE OPTIMIZATION ---
  // Cache for 60 seconds (fresh), serve stale for 10 minutes (600s) while revalidating in background.
  // This prevents hitting Notion API on every single page load.
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  // Default to env var, but allow override via query param
  const NOTION_DATABASE_ID = request.query.db_id || process.env.NOTION_DATABASE_ID;
  const { cursor, category } = request.query; 

  // 1. Check Credentials
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return response.status(401).json({ 
      error: 'Notion credentials missing (API Key or Database ID).' 
    });
  }

  try {
    const headers = {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 2. Fetch Database Metadata to get Category Options
    // We do this to ensure tabs match Notion's configuration exactly
    let categoryOptions = [];
    let categoryPropName = '';

    try {
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
            }
        });
        if (dbRes.ok) {
            const dbData = await dbRes.json();
            const properties = dbData.properties || {};
            
            // Try to find the Category property (checking common names)
            const candidateNames = ['Category', 'Class', 'Type', '分类', '类别'];
            
            // First pass: look for exact name match in candidates
            for (const key in properties) {
                if (properties[key].type === 'select' && candidateNames.includes(key)) {
                    categoryPropName = key;
                    categoryOptions = properties[key].select.options.map(o => o.name);
                    break;
                }
            }

            // Second pass: if not found, look for partial match
            if (!categoryPropName) {
                for (const key in properties) {
                    if (properties[key].type === 'select' && candidateNames.some(n => key.includes(n))) {
                        categoryPropName = key;
                        categoryOptions = properties[key].select.options.map(o => o.name);
                        break;
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Failed to fetch database metadata for categories", e);
    }

    // 3. Prepare Query Body with Filter AND Sorting
    // Added 'sorts' to prioritize latest updated content
    const queryBody = {
      page_size: 48, // Load 48 items per page as requested
      start_cursor: cursor || undefined,
      sorts: [
        {
            timestamp: 'last_edited_time',
            direction: 'descending',
        }
      ]
    };

    // Apply Filter if category is selected and valid property found
    if (category && category !== '全部' && categoryPropName) {
        queryBody.filter = {
            property: categoryPropName,
            select: {
                equals: category
            }
        };
    }

    // 4. Fetch Database Pages
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(queryBody),
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
    
    // 5. ENRICHMENT STEP: Fetch first content block for each page to find an image
    // Note: This operation is expensive (N+1 requests). Caching helps significantly here.
    const enrichedResults = await Promise.all(rawPages.map(async (page) => {
        try {
            const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=5`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                },
            });

            if (blocksRes.ok) {
                const blocksData = await blocksRes.json();
                const imageBlock = blocksData.results.find(b => b.type === 'image');
                
                if (imageBlock) {
                    const imageUrl = imageBlock.image.type === 'file' 
                        ? imageBlock.image.file.url 
                        : imageBlock.image.external.url;
                    return { ...page, first_content_image: imageUrl };
                }
            }
        } catch (error) {
            console.error(`Failed to fetch blocks for page ${page.id}`, error);
        }
        return page; 
    }));
    
    // 6. Return results + Dynamic Categories
    return response.status(200).json({ 
        results: enrichedResults,
        next_cursor: data.next_cursor,
        has_more: data.has_more,
        // Always include '全部' at the start
        categories: ['全部', ...categoryOptions]
    });

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}