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
    const notionRes = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!notionRes.ok) {
      const errorText = await notionRes.text();
      console.error('Notion Content API Error:', errorText);
      return response.status(notionRes.status).json({ error: errorText });
    }

    const data = await notionRes.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}