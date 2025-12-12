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
    // 2. Fetch from Notion
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    // 3. Handle Notion Errors
    if (!notionRes.ok) {
      const errorText = await notionRes.text();
      console.error('Notion API Error:', errorText);
      return response.status(notionRes.status).json({ error: 'Notion API refused connection', details: errorText });
    }

    const data = await notionRes.json();
    
    // 4. Success
    return response.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}