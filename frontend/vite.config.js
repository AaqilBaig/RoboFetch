import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/auth': 'https://robofetch-server.onrender.com',
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@chakra-ui/react': '@chakra-ui/react',
    },
  },
})