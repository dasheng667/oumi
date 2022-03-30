import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import pkg from '../oumi-cli-ui/package.json';

const resolve = (dir: string) => {
  return path.resolve(__dirname, './', dir);
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9001,
    proxy: {
      '/api/': {
        target: 'http://localhost:9000',
        changeOrigin: true
        // rewrite: (p) => p.replace(/^\/api/, '')
      }
    },
    fs: {
      strict: false,
      // 可以为项目根目录的上一级提供服务
      allow: ['../oumi-swagger-api']
    }
  },
  define: {
    AppVersion: JSON.stringify(pkg.version)
  },
  build: {
    outDir: '../oumi-cli-ui/public',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@src': resolve('./src'),
      '@oumi/swagger-api': resolve('../oumi-swagger-api')
    }
  },
  plugins: [reactRefresh()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
});
