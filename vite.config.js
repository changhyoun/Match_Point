import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

const repoName = 'Match_Point'; // 리포지토리 이름

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [
    react(),
    {
      name: 'copy-404',
      apply: 'build',
      closeBundle() {
        const buildDir = resolve(__dirname, 'dist');
        const indexPath = resolve(buildDir, 'index.html');
        const errorPath = resolve(buildDir, '404.html');

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, errorPath);
          console.log('Successfully copied index.html to 404.html');
        } else {
          console.error('index.html not found, could not copy to 404.html');
        }
      },
    },
  ],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "./src/styles/global.css";`,
      },
    },
  },
  json: {
    namedExports: true,
    stringify: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dapi.kakao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});