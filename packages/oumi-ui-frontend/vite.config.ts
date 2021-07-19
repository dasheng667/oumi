import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

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
    }
  },
  build: {
    outDir: '../oumi-ui/public'
  },
  resolve: {
    alias: {
      '@src': resolve('./src')
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
