import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pre-declare the react-icons sets this app imports so Vite bundles them at
  // startup instead of mid-session, which otherwise forces a full page reload.
  optimizeDeps: {
    include: ['react-icons/fi', 'react-icons/md']
  },
  server: {port : 5174}
})
