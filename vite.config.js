import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Expose aussi les vars commençant par URL_ (ex. URL_SUPABASE_VITE sur Vercel) en plus de VITE_
  envPrefix: ['VITE_', 'URL_'],
  build: {
    outDir: 'dist',
  },
})
