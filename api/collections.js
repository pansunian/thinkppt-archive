
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DB_COLLECTIONS_ID = process.env.NOTION_DB_COLLECTIONS_ID;

  if (!NOTION_API_KEY || !NOTION_DB_COLLECTIONS_ID) {
    // Return empty array if not configured, so frontend falls back to mock or empty state gracefully
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_COLLECTIONS_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Only fetch published items if you have a status property, otherwise fetch all
        // filter: { property: 'Status', status: { equals: 'Published' } },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
      }),
    });

    if (!response.ok) {
        throw new Error('Notion API error');
    }

    const data = await response.json();
    
    // Mapper: Convert Notion Page to Collection Object
    const collections = data.results.map(page => {
        const props = page.properties;
        
        const getText = (name) => {
            const p = props[name];
            if (!p) return '';
            if (p.type === 'title') return p.title?.[0]?.plain_text || '';
            if (p.type === 'rich_text') return p.rich_text?.[0]?.plain_text || '';
            return '';
        };

        const getCover = () => {
            // Priority: 1. 'Cover' property 2. Page Cover
            const p = props['Cover'] || props['Image'] || props['Poster'];
            if (p && p.type === 'files' && p.files.length > 0) {
                const file = p.files[0];
                return file.type === 'file' ? file.file.url : file.external.url;
            }
            if (page.cover) {
                return page.cover.type === 'file' ? page.cover.file.url : page.cover.external.url;
            }
            return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'; // Fallback
        };

        const getRelationIds = (name) => {
            const p = props[name] || props['Schemes'] || props['方案'];
            if (p && p.type === 'relation') {
                return p.relation.map(r => r.id);
            }
            return [];
        };

        return {
            id: page.id,
            title: getText('Name') || getText('Title') || '未命名展览',
            subtitle: getText('Subtitle') || getText('副标题') || '',
            description: getText('Description') || getText('简介') || '',
            coverImage: getCover(),
            schemeIds: getRelationIds('Schemes'),
            themeColor: getText('ThemeColor') || '#1A1A1A'
        };
    });

    return new Response(JSON.stringify({ results: collections }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=30',
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ results: [], error: 'Failed to fetch collections' }), { status: 500 });
  }
}
