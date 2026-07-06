import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Requests arrive via Traefik with Host: tracking.zippd.local, which
    // Vite would otherwise reject as a potential DNS-rebinding attack.
    allowedHosts: ['tracking.zippd.local', 'localhost'],
  },
})
