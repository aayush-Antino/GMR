import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://d2lsztcb5y4nf9.cloudfront.net/mdms',
          changeOrigin: true,
          secure: false,
          timeout: 60000,
          proxyTimeout: 60000,
        },
      },
    },
  }
})
