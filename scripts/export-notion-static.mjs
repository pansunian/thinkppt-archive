import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NOTION_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const cwd = process.cwd();
const dataDir = path.join(cwd, 'public', 'data');
const databaseDir = path.join(dataDir, 'databases');
const pageDir = path.join(dataDir, 'pages');
const contentDir = path.join(dataDir, 'content');
const mediaDir = path.join(dataDir, 'media');

const notionApiKey = process.env.NOTION_API_KEY;
const mainDatabaseId = process.env.NOTION_DATABASE_ID;
const aiDatabaseId = process.env.NOTION_DB_AI_ID;
const aboutPageId = process.env.NOTION_PAGE_ABOUT_ID;
const subscribePageId = process.env.NOTION_PAGE_SUBSCRIBE_ID;

const notionHeaders = {
  Authorization: `Bearer ${notionApiKey}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
};

const mediaCache = new Map();

async function fetchWithTimeout(url, init = {}, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function findCachedMedia(hash) {
  if (!existsSync(mediaDir)) return null;

  const files = await readdir(mediaDir);
  return files.find(file => file.startsWith(`${hash}.`)) || null;
}

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

function normalizeId(id) {
  return id.replace(/-/g, '');
}

function mediaExtension(url, contentType = '') {
  if (contentType.includes('image/png')) return '.png';
  if (contentType.includes('image/webp')) return '.webp';
  if (contentType.includes('image/gif')) return '.gif';
  if (contentType.includes('image/svg')) return '.svg';
  if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) return '.jpg';

  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) return ext;
  } catch {}

  return '.jpg';
}

async function notionFetch(endpoint, init = {}) {
  const res = await fetchWithTimeout(`${NOTION_BASE}${endpoint}`, {
    ...init,
    headers: {
      ...notionHeaders,
      ...(init.headers || {}),
    },
  }, 20_000);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion request failed ${res.status} ${endpoint}: ${body.slice(0, 300)}`);
  }

  return res.json();
}

async function fetchDatabaseMeta(databaseId) {
  const dbData = await notionFetch(`/databases/${databaseId}`, { method: 'GET' });
  const properties = dbData.properties || {};
  const categoryCandidates = ['Category', 'Class', 'Type', '分类', '类别'];
  const featuredCandidates = ['编辑推荐', 'Featured', 'featured', 'Editor Pick', '推荐', '精选'];

  let categoryPropName = '';
  let featuredPropName = '';
  let categoryOptions = [];

  for (const key of Object.keys(properties)) {
    const prop = properties[key];
    if (!categoryPropName && prop.type === 'select' && (categoryCandidates.includes(key) || categoryCandidates.some(name => key.includes(name)))) {
      categoryPropName = key;
      categoryOptions = prop.select.options.map(option => option.name);
    }
    if (!featuredPropName && prop.type === 'checkbox' && featuredCandidates.includes(key)) {
      featuredPropName = key;
    }
  }

  return { categoryPropName, featuredPropName, categoryOptions };
}

async function fetchDatabasePages(databaseId) {
  const meta = await fetchDatabaseMeta(databaseId);
  const sorts = [];

  if (meta.featuredPropName) {
    sorts.push({ property: meta.featuredPropName, direction: 'descending' });
  }
  sorts.push({ timestamp: 'last_edited_time', direction: 'descending' });

  let nextCursor;
  const results = [];

  do {
    const data = await notionFetch(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        page_size: 100,
        start_cursor: nextCursor,
        sorts,
      }),
    });

    results.push(...(data.results || []));
    nextCursor = data.has_more ? data.next_cursor : undefined;
  } while (nextCursor);

  const enrichedResults = [];
  for (const page of results) {
    enrichedResults.push(await enrichFirstContentImage(page));
  }

  return {
    results: enrichedResults,
    next_cursor: null,
    has_more: false,
    categories: ['全部', ...meta.categoryOptions],
  };
}

async function enrichFirstContentImage(page) {
  try {
    const data = await notionFetch(`/blocks/${page.id}/children?page_size=20`, { method: 'GET' });
    const imageBlock = (data.results || []).find(block => block.type === 'image');
    if (!imageBlock) return page;

    const imageUrl = imageBlock.image.type === 'file'
      ? imageBlock.image.file.url
      : imageBlock.image.external.url;

    return { ...page, first_content_image: imageUrl };
  } catch {
    return page;
  }
}

async function fetchPage(pageId) {
  const page = await notionFetch(`/pages/${pageId}`, { method: 'GET' });
  return enrichFirstContentImage(page);
}

async function fetchChildrenRecursively(blockId) {
  const data = await notionFetch(`/blocks/${blockId}/children?page_size=100`, { method: 'GET' });
  const blocks = data.results || [];
  const output = [];

  for (const block of blocks) {
    if (block.has_children && ['column_list', 'column', 'toggle'].includes(block.type)) {
      block.children = await fetchChildrenRecursively(block.id);
    }
    output.push(block);
  }

  return output;
}

async function localizeImageUrl(url, cacheKey = url) {
  if (!url || !/^https?:\/\//i.test(url)) return url;
  if (mediaCache.has(cacheKey)) return mediaCache.get(cacheKey);

  const hash = createHash('sha256').update(cacheKey).digest('hex').slice(0, 20);
  const cachedFilename = await findCachedMedia(hash);

  if (cachedFilename) {
    const staticUrl = `/data/media/${cachedFilename}`;
    mediaCache.set(cacheKey, staticUrl);
    return staticUrl;
  }

  let res;

  try {
    res = await fetchWithTimeout(url, {}, 15_000);
  } catch (error) {
    console.warn(`Skipping image ${url}: ${error.name === 'AbortError' ? 'timeout' : error.message}`);
    return url;
  }

  if (!res.ok) {
    console.warn(`Skipping image ${url}: ${res.status}`);
    return url;
  }

  const contentType = res.headers.get('content-type') || '';
  const ext = mediaExtension(url, contentType);
  const filename = `${hash}${ext}`;
  const outputPath = path.join(mediaDir, filename);

  if (!existsSync(outputPath)) {
    const bytes = Buffer.from(await res.arrayBuffer());
    await writeFile(outputPath, bytes);
  }

  const staticUrl = `/data/media/${filename}`;
  mediaCache.set(cacheKey, staticUrl);
  return staticUrl;
}

async function localizePageMedia(page) {
  if (page.first_content_image) {
    page.first_content_image = await localizeImageUrl(page.first_content_image, `${page.id}:first_content_image`);
  }

  if (page.cover?.type === 'external' && page.cover.external?.url) {
    page.cover.external.url = await localizeImageUrl(page.cover.external.url, `${page.id}:cover`);
  }

  if (page.cover?.type === 'file' && page.cover.file?.url) {
    page.cover.file.url = await localizeImageUrl(page.cover.file.url, `${page.id}:cover`);
  }

  for (const [propName, prop] of Object.entries(page.properties || {})) {
    if (prop.type !== 'files') continue;
    for (const [index, file] of (prop.files || []).entries()) {
      const key = `${page.id}:property:${propName}:${file.name || index}`;
      if (file.type === 'external' && file.external?.url) {
        file.external.url = await localizeImageUrl(file.external.url, key);
      }
      if (file.type === 'file' && file.file?.url) {
        file.file.url = await localizeImageUrl(file.file.url, key);
      }
    }
  }

  return page;
}

async function localizeBlockMedia(block) {
  if (block.type === 'image') {
    const image = block.image;
    if (image?.type === 'external' && image.external?.url) {
      image.external.url = await localizeImageUrl(image.external.url, `${block.id}:image`);
    }
    if (image?.type === 'file' && image.file?.url) {
      image.file.url = await localizeImageUrl(image.file.url, `${block.id}:image`);
    }
  }

  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      await localizeBlockMedia(child);
    }
  }

  return block;
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data)}\n`);
}

async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });

  await Promise.all(workers);
}

async function exportDatabase(key, databaseId) {
  if (!databaseId) return null;

  console.log(`Exporting database: ${key}`);
  const data = await fetchDatabasePages(databaseId);

  for (const page of data.results) {
    await localizePageMedia(page);
  }

  await writeJson(path.join(databaseDir, `${key}.json`), data);

  return {
    id: normalizeId(databaseId),
    file: `/data/databases/${key}.json`,
    count: data.results.length,
    categories: data.categories,
  };
}

async function exportPage(key, pageId) {
  if (!pageId) return null;

  console.log(`Exporting page: ${key}`);
  const page = await fetchPage(pageId);
  await localizePageMedia(page);
  await writeJson(path.join(pageDir, `${normalizeId(pageId)}.json`), page);

  return {
    id: normalizeId(pageId),
    file: `/data/pages/${normalizeId(pageId)}.json`,
  };
}

async function exportContent(pageId) {
  const normalizedId = normalizeId(pageId);
  const blocks = await fetchChildrenRecursively(pageId);

  for (const block of blocks) {
    await localizeBlockMedia(block);
  }

  await writeJson(path.join(contentDir, `${normalizedId}.json`), { results: blocks });
}

async function main() {
  requireEnv('NOTION_API_KEY', notionApiKey);
  requireEnv('NOTION_DATABASE_ID', mainDatabaseId);

  await rm(databaseDir, { recursive: true, force: true });
  await rm(pageDir, { recursive: true, force: true });
  await rm(contentDir, { recursive: true, force: true });
  await rm(path.join(dataDir, 'manifest.json'), { force: true });
  await mkdir(databaseDir, { recursive: true });
  await mkdir(pageDir, { recursive: true });
  await mkdir(contentDir, { recursive: true });
  await mkdir(mediaDir, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    databases: {},
    pages: {},
  };

  manifest.databases.main = await exportDatabase('main', mainDatabaseId);
  manifest.databases.ai = await exportDatabase('ai', aiDatabaseId);
  manifest.pages.about = await exportPage('about', aboutPageId);
  manifest.pages.subscribe = await exportPage('subscribe', subscribePageId);

  const contentIds = new Set();
  for (const database of ['main', 'ai']) {
    const meta = manifest.databases[database];
    if (!meta) continue;
    const data = JSON.parse(await readFile(path.join(databaseDir, `${database}.json`), 'utf8'));
    for (const page of data.results || []) {
      contentIds.add(page.id);
    }
  }
  for (const page of Object.values(manifest.pages)) {
    if (page?.id) contentIds.add(page.id);
  }

  await runWithConcurrency([...contentIds], 3, async (pageId) => {
    console.log(`Exporting content: ${pageId}`);
    await exportContent(pageId);
  });

  await writeJson(path.join(dataDir, 'manifest.json'), manifest);
  console.log(`Static export complete: ${dataDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
