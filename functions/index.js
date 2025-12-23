import { onRequest as schemesHandler } from './api/schemes.js';
import { onRequest as contentHandler } from './api/content.js';
import { onRequest as pageHandler } from './api/page.js';

/**
 * 阿里云 ESA 边缘函数统一入口
 * 处理逻辑：根据 URL 路径分发到对应的处理函数
 */
export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 封装 context 兼容之前的 Cloudflare 函数格式
    const cfContext = { request, env, next: () => {} };

    try {
      if (path === '/api/schemes') {
        return await schemesHandler(cfContext);
      } else if (path === '/api/content') {
        return await contentHandler(cfContext);
      } else if (path === '/api/page') {
        return await pageHandler(cfContext);
      }

      // 如果不是 API 请求，且配置了 Assets，通常 ESA 会自动处理静态资源
      // 但在函数中我们可以手动兜底
      return new Response('Not Found', { status: 404 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  }
};