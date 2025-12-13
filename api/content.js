export default async function handler(request, response) {
  const { id } = request.query;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY) {
    return response.status(401).json({ error: 'Notion API Key missing' });
  }

  if (!id) {
    return response.status(400).json({ error: 'Missing page ID' });
  }

  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
  };

  // Helper function to recursively fetch children for specific block types
  const fetchChildrenRecursively = async (blockId) => {
    try {
      const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
        method: 'GET',
        headers: headers,
      });

      if (!res.ok) return [];
      const data = await res.json();
      const blocks = data.results || [];

      // Process blocks in parallel to check for nested content
      // We only recurse for layout blocks: column_list, column, toggle
      const enrichedBlocks = await Promise.all(blocks.map(async (block) => {
        if (block.has_children && ['column_list', 'column', 'toggle'].includes(block.type)) {
          block.children = await fetchChildrenRecursively(block.id);
        }
        return block;
      }));

      return enrichedBlocks;
    } catch (error) {
      console.error(`Error fetching children for block ${blockId}:`, error);
      return [];
    }
  };

  try {
    // Fetch top-level blocks
    const results = await fetchChildrenRecursively(id);
    return response.status(200).json({ results });
  } catch (error) {
    console.error('Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}