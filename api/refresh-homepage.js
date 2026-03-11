export const config = {
  runtime: 'edge',
};

const NOTION_BASE = 'https://api.notion.com/v1';

export default async function handler(request) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  const BASE_URL = new URL(request.url).origin;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 401 });
  }

  const results = {};

  try {
    // 1. 获取分类列表
    const dbRes = await fetch(`${NOTION_BASE}/databases/${NOTION_DATABASE_ID}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });

    let categories = ['全部'];
    if (dbRes.ok) {
      const dbData = await dbRes.json();
      const properties = dbData.properties || {};
      for (const key in properties) {
        const prop = properties[key];
        if (prop.type === 'select' && ['Category', 'Class', 'Type', '分类', '类别'].some(n => key.includes(n))) {
          categories = ['全部', ...prop.select.options.map(o => o.name)];
          break;
        }
      }
    }

    // 2. 预热首页 + 所有分类
    const categoriesToWarm = categories;
    for (const cat of categoriesToWarm) {
      try {
        const params = cat === '全部' ? '' : `&category=${encodeURIComponent(cat)}`;
        await fetch(`${BASE_URL}/api/schemes?refresh=true${params}`);
        results[`schemes-${cat}`] = 'warmed';
      } catch (e) {
        results[`schemes-${cat}`] = 'failed';
      }
    }

    // 3. 预热「关于」「订阅」页面
    const pageIds = [
      process.env.NOTION_PAGE_ABOUT_ID,
      process.env.NOTION_PAGE_SUBSCRIBE_ID
    ].filter(Boolean);

    for (const id of pageIds) {
      try {
        await fetch(`${BASE_URL}/api/page?id=${id}&refresh=true`);
        results[`page-${id}`] = 'warmed';
      } catch (e) {
        results[`page-${id}`] = 'failed';
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
