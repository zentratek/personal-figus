import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Enable HTTPS with self-signed certificate
  ],
  server: {
    https: true, // Enable HTTPS
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  }
})
