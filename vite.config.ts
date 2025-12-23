import path from 'path';
import { defineConfig } from 'vite';

// import { VitePWA } from 'vite-plugin-pwa';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'Plan Project',
    //     short_name: 'Plan Project Platform',
    //     start_url: '/',
    //     display: 'standalone', // or 'fullscreen'
    //     background_color: '#ffffff',
    //     theme_color: '#ffffff',
    //     // icons: [
    //     //   {
    //     //     src: 'pwa-192x192.png',
    //     //     sizes: '192x192',
    //     //     type: 'image/png',
    //     //   },
    //     //   {
    //     //     src: 'pwa-512x512.png',
    //     //     sizes: '512x512',
    //     //     type: 'image/png',
    //     //   },
    //     //   {
    //     //     src: 'pwa-512x512.png',
    //     //     sizes: '512x512',
    //     //     type: 'image/png',
    //     //     purpose: 'any maskable',
    //     //   },
    //     // ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
  },
});
