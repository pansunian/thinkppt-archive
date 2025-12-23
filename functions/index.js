import { onRequest as schemesHandler } from './api/schemes.js';
import { onRequest as contentHandler } from './api/content.js';
import { onRequest as pageHandler } from './api/page.js';

/**
 * 阿里云 ESA 边缘函数统一入口
 * 处理逻辑：根据 URL 路径分发到对应的 API 处理函数，并支持静态资源与 SPA 路由。
 */
export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API 路由分发
    if (path.startsWith('/api/')) {
      const cfContext = { request, env, next: () => {} };
      try {
        if (path === '/api/schemes') return await schemesHandler(cfContext);
        if (path === '/api/content') return await contentHandler(cfContext);
        if (path === '/api/page') return await pageHandler(cfContext);
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500,
          headers: { 'content-type': 'application/json' }
        });
      }
    }

    // 2. 静态资源兜底与 SPA 路由处理
    // 在 Aliyun ESA 环境中，env.ASSETS 允许从绑定的 Assets 目录中获取文件
    try {
      let response = await env.ASSETS.fetch(request);
      
      // 如果资源未找到（404）且不像是请求一个具体的静态文件（通过判断路径最后一部分是否包含点号）
      // 则返回 index.html 以支持 SPA 客户端路由
      if (response.status === 404 && !path.split('/').pop().includes('.')) {
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        response = await env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (e) {
      // 出现异常或完全无法找到资源
      return new Response('Not Found', { status: 404 });
    }
  }
};
