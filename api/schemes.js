export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  // If credentials are not set, return 401 to let frontend know to use mock data
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return new Response(
      JSON.stringify({ error: 'Notion credentials missing' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
        // Optional: Only show items where 'Status' is 'Published'
        // filter: {
        //   property: "Status",
        //   status: { equals: "Published" }
        // }
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=10, stale-while-revalidate=59', // Cache for speed
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from Notion' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}