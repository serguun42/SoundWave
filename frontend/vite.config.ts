import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

const envDev = loadEnv('development', process.cwd(), '');

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./cert-key.pem'),
      cert: fs.readFileSync('./cert-chain-localhost.pem'),
    },
    proxy: {
      '/api': {
        target: envDev.VITE_API_HOST,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
    },
  },
});
