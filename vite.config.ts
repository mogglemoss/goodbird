import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // The 7 unit JSONs are inlined via import.meta.glob({eager:true}) so the
    // entire app shell + all content lives in one chunk. ~580 KB raw / ~170 KB
    // gzip — fine for prototype scale. Real code-splitting would require async
    // manifest loading and loading states across every route.
    chunkSizeWarningLimit: 800,
  },
})
