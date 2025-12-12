import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // This injects the API_KEY from Vercel Environment Variables into the client-side code at build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
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