import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',   // <--- add this line
  plugins: [vue()],
})
