import { onRequest as schemesHandler } from './api/schemes.js';
import { onRequest as contentHandler } from './api/content.js';
import { onRequest as pageHandler } from './api/page.js';

/**
 * 阿里云 ESA 边缘函数统一入口
 * 处理逻辑：
 * 1. 匹配 /api/ 路径并分发到对应模块。
 * 2. 其它路径通过 env.ASSETS 尝试读取静态资源。
 * 3. 如果资源未找到（404）且非文件请求，则返回 index.html 以支持单页应用路由。
 */
export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API 路由处理
    if (path.startsWith('/api/')) {
      const apiContext = { request, env, next: () => {} };
      try {
        if (path === '/api/schemes') return await schemesHandler(apiContext);
        if (path === '/api/content') return await contentHandler(apiContext);
        if (path === '/api/page') return await pageHandler(apiContext);
        
        return new Response(JSON.stringify({ error: 'API route not found' }), { 
          status: 404,
          headers: { 'content-type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500,
          headers: { 'content-type': 'application/json' }
        });
      }
    }

    // 2. 静态资源与 SPA 路由兜底
    try {
      // 这里的 env.ASSETS 是在 esa.jsonc 中定义的 binding
      let response = await env.ASSETS.fetch(request);
      
      // 如果 404 且路径末尾不包含扩展名（如 .js, .css, .png），说明可能是前端路由
      if (response.status === 404 && !path.split('/').pop().includes('.')) {
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        response = await env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (e) {
      return new Response('Asset Fetch Error', { status: 500 });
    }
  }
};