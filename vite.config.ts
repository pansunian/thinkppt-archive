import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // This injects the API_KEY and Database IDs from Vercel Environment Variables into the client-side code at build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      
      // 1. Main Database (方案 - Default)
      'process.env.NOTION_DATABASE_ID': JSON.stringify(env.NOTION_DATABASE_ID),
      
      // 2. Secondary Database (AI)
      'process.env.NOTION_DB_AI_ID': JSON.stringify(env.NOTION_DB_AI_ID),
      
      // 3. Independent Pages (关于, 订阅)
      'process.env.NOTION_PAGE_ABOUT_ID': JSON.stringify(env.NOTION_PAGE_ABOUT_ID),
      'process.env.NOTION_PAGE_SUBSCRIBE_ID': JSON.stringify(env.NOTION_PAGE_SUBSCRIBE_ID),
    },
    server: {
      proxy: {
        // Proxy API requests to Vercel functions during local dev (optional but good practice)
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});