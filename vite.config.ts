import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_BASE_PATH env variable, fallback to repo name for GitHub Pages
// For custom domain, set VITE_BASE_PATH=/ in build command
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/trade-tracker/',
}))
