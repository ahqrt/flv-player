import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'flv.js',
        replacement: resolve(__dirname, './src/flv/src/flv.js')
      }
    ]
  }
})
