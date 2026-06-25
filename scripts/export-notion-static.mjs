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
const ipArchiveDatabaseId = process.env.NOTION_IP_ARCHIVE_DATABASE_ID || '1d61fef3c4414a1e8870240cda37935f';
const aboutPageId = process.env.NOTION_PAGE_ABOUT_ID;
const subscribePageId = process.env.NOTION_PAGE_SUBSCRIBE_ID;
const mediaMode = process.env.NOTION_MEDIA_MODE || 'all';
const mediaDownloadLimit = Number.parseInt(process.env.NOTION_MEDIA_DOWNLOAD_LIMIT || '0', 10);
const hasMediaDownloadLimit = Number.isFinite(mediaDownloadLimit) && mediaDownloadLimit > 0;
const contentExportMode = process.env.NOTION_CONTENT_EXPORT_MODE || 'all';
const shouldExportContent = !['none', 'false', '0'].includes(contentExportMode.toLowerCase());
const shouldEnrichFirstImage = process.env.NOTION_ENRICH_FIRST_IMAGE !== 'false';

const notionHeaders = {
  Authorization: `Bearer ${notionApiKey}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
};

const mediaCache = new Map();
const retryableStatuses = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
let mediaDownloadAttempts = 0;
let mediaSkippedByLimit = 0;

const fallbackIpArchives = [
  ['慢人节', '小红书', '2024', 1, '小红书生活方式情绪 IP', '围绕慢生活、城市散步、情绪疗愈与线下体验，观察小红书如何把生活态度包装成可招商的长期 IP。', '/scheme-pages/xiaohongshu/manrenjie/2024-tongan/page-001.webp', '2024小红书慢人节招商通案', '/scheme-pages/xiaohongshu/manrenjie/2024-tongan', '1,3,12,33', '封面、慢人心态、平台级事件、慢人路线', '方案封面、核心情绪、平台招商逻辑、线下路线规划'],
  ['慢人节', '小红书', '2024', 1, '小红书生活方式情绪 IP', '围绕慢生活、城市散步、情绪疗愈与线下体验，观察小红书如何把生活态度包装成可招商的长期 IP。', '/scheme-pages/xiaohongshu/manrenjie/2024-2/page-001.webp', '小红书2024慢人节2.0营销方案', '/scheme-pages/xiaohongshu/manrenjie/2024-2', '1,5,8,23', '封面、慢人群趋势、核心洞察、长线运营', '方案封面、人群趋势、H2H 洞察、长线资源阵地'],
  ['慢人节', '小红书', '2025', 1, '小红书长线生活方式 IP', '从年度招商走向长线 IP 规划，观察慢人节如何扩展为音乐会、市集、路线与内容平台组合。', '/scheme-pages/xiaohongshu/manrenjie/2025-planning/page-001.webp', '小红书慢人节2025年长线IP规划', '/scheme-pages/xiaohongshu/manrenjie/2025-planning', '1,3,21,28', '封面、年度规划、内容阵地、用户旅程', '2025长线规划、全年内容结构、平台内容合作、用户路径设计'],
  ['遛遛生活', '小红书', '2025', 3, '城市市集与本地生活 IP', '把城市散步、社区市集、线下摊位与品牌共创组合成可参与的生活方式场景。', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80', '遛遛生活城市企划招商方案'],
  ['闪光青春派', '小红书', '2025', 2, '小红书校园开学季 IP', '面向大学生开学节点，把内容共创、校园场景和品牌曝光整合成年度校园营销资产。', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80', '闪光青春派校园季招商方案'],
  ['我就要这样生活', '小红书', '2025', 4, '小红书文娱生活态度 IP', '用生活主张承接年轻人情绪表达，把文娱内容、社区讨论和品牌合作包装成平台级 IP。', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80', '我就要这样生活招商方案'],
  ['雪人节', '小红书', '2024-2025', 1, '小红书冬季节点 IP', '以雪、旅行、礼赠和冬日情绪为入口，适合观察年末节点如何从氛围感转化为招商权益。', 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1400&q=80', '雪人节冬季营销招商方案'],
  ['外人节', '小红书', '2024', 1, '小红书户外生活方式 IP', '以走到户外、成为外人为核心主张，持续追踪小红书户外生活方式 IP 的招商演进。', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', '外人节户外生活方式招商方案'],
  ['拜年纪', 'bilibili', '2025-2026', 2, 'B站春节内容 IP', 'B站最具代表性的春节内容资产，适合观察二次元社区、UP主内容与品牌春节节点合作方式。', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80', '拜年纪春节招商方案'],
  ['百大UP主盛典', 'bilibili', '2024', 1, 'B站年度创作者盛典 IP', '围绕头部 UP 主和社区荣誉体系，展示 B站如何把创作者生态包装为品牌赞助场景。', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80', '百大UP主盛典品牌合作方案'],
  ['我们野太会了吧', 'bilibili', '2025', 1, 'B站户外综艺 IP', '聚焦山野、徒步与年轻人的户外兴趣，适合观察垂类内容 IP 的招商价值。', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80', '我们野太会了吧招商方案'],
  ['校园IP生活B修课', 'bilibili', '2025', 1, 'B站校园生活 IP', '从大学生日常场景切入，连接宿舍、食堂、学习和社交，适合校园消费品牌。', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=80', '校园IP生活B修课招商方案'],
  ['抖音节气 IP', '抖音', '2025', 1, '抖音传统文化节点 IP', '用二十四节气作为全年内容日历，把传统文化、达人内容和品牌种草连成长期资产。', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80', '抖音节气文化 IP 招商方案'],
  ['快手春节 IP', '快手', '2026', 5, '快手春节节点 IP', '围绕 CNY、晚会、互动和站内资源，观察快手如何把春节流量转化为平台招商权益。', 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1400&q=80', '快手春节 CNY 招商通案'],
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  let lastError;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetchWithTimeout(`${NOTION_BASE}${endpoint}`, {
        ...init,
        headers: {
          ...notionHeaders,
          ...(init.headers || {}),
        },
      }, 20_000);

      if (res.ok) return res.json();

      const body = await res.text();
      const message = `Notion request failed ${res.status} ${endpoint}: ${body.slice(0, 300)}`;
      lastError = new Error(message);

      if (!retryableStatuses.has(res.status) || attempt === 4) {
        throw lastError;
      }

      const retryAfter = Number(res.headers.get('retry-after'));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 800 * 2 ** attempt);
    } catch (error) {
      lastError = error;
      if (attempt === 4) throw lastError;
      await sleep(800 * 2 ** attempt);
    }
  }

  throw lastError;
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
  if (shouldEnrichFirstImage) {
    for (const page of results) {
      enrichedResults.push(await enrichFirstContentImage(page));
    }
  } else {
    enrichedResults.push(...results);
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
  if (!shouldEnrichFirstImage) return page;
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

  if (hasMediaDownloadLimit && mediaDownloadAttempts >= mediaDownloadLimit) {
    mediaSkippedByLimit += 1;
    return url;
  }

  mediaDownloadAttempts += 1;
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
  if (mediaMode === 'none') return page;

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
  if (mediaMode !== 'all') return block;

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

function titleProp(value) {
  return { type: 'title', title: [{ plain_text: value }] };
}

function richTextProp(value) {
  return { type: 'rich_text', rich_text: [{ plain_text: value }] };
}

function createFallbackIpArchiveData() {
  return {
    results: fallbackIpArchives.map(([name, platform, years, count, position, summary, cover, plan, pageDir, pageNumbers, pageTitles, pageNotes], index) => ({
      id: `fallback-ip-${index + 1}`,
      properties: {
        IP名称: titleProp(name),
        平台: { type: 'select', select: { name: platform } },
        前端展示: { type: 'checkbox', checkbox: true },
        整理状态: { type: 'select', select: { name: '精选' } },
        排序: { type: 'number', number: (index + 1) * 10 },
        年份跨度: richTextProp(years),
        方案数: { type: 'number', number: count },
        定位: richTextProp(position),
        策展摘要: richTextProp(summary),
        封面图: { type: 'url', url: cover },
        封面来源: { type: 'select', select: { name: pageDir ? 'OSS' : '临时占位' } },
        代表方案: richTextProp(plan),
        页面图OSS目录: { type: 'url', url: pageDir || '' },
        精选页码: richTextProp(pageNumbers || ''),
        精选页标题: richTextProp(pageTitles || ''),
        精选页说明: richTextProp(pageNotes || ''),
      },
    })),
    next_cursor: null,
    has_more: false,
    categories: ['全部'],
  };
}

async function exportOptionalIpArchiveDatabase(databaseId) {
  try {
    return await exportDatabase('ip-archives', databaseId);
  } catch (error) {
    console.warn(`IP archive database export failed, using fallback data: ${error.message}`);
    const data = createFallbackIpArchiveData();
    await writeJson(path.join(databaseDir, 'ip-archives.json'), data);
    return {
      id: normalizeId(databaseId),
      file: '/data/databases/ip-archives.json',
      count: data.results.length,
      categories: data.categories,
      fallback: true,
    };
  }
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
  manifest.databases.ipArchives = await exportOptionalIpArchiveDatabase(ipArchiveDatabaseId);
  manifest.pages.about = await exportPage('about', aboutPageId);
  manifest.pages.subscribe = await exportPage('subscribe', subscribePageId);

  if (shouldExportContent) {
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

    await runWithConcurrency([...contentIds], 2, async (pageId) => {
      console.log(`Exporting content: ${pageId}`);
      await exportContent(pageId);
    });
  } else {
    console.log(`Skipping page content export: NOTION_CONTENT_EXPORT_MODE=${contentExportMode}`);
  }

  manifest.media = {
    mode: mediaMode,
    downloadLimit: hasMediaDownloadLimit ? mediaDownloadLimit : null,
    downloadedOrAttempted: mediaDownloadAttempts,
    skippedByLimit: mediaSkippedByLimit,
    enrichedFirstImage: shouldEnrichFirstImage,
  };
  manifest.content = {
    mode: contentExportMode,
    exported: shouldExportContent,
  };

  await writeJson(path.join(dataDir, 'manifest.json'), manifest);
  console.log(`Media localization: mode=${mediaMode}, attempted=${mediaDownloadAttempts}, skippedByLimit=${mediaSkippedByLimit}`);
  console.log(`Static export complete: ${dataDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
