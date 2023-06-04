import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

export default defineConfig(({ command, mode }) => {
  const base_config: UserConfig = {
    plugins: [react()],
  };

  if (command === 'serve') { // for development
    const env = loadEnv(mode, process.cwd(), '');

    base_config.server = {
      https: {
        key: fs.readFileSync('./cert-key.pem'),
        cert: fs.readFileSync('./cert-chain-localhost.pem'),
      },
      proxy: {
        '/api': {
          target: env.VITE_API_HOST,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
        },
      },
    };
  }

  return base_config;
});
