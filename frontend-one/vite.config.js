import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.16.111:3333', // URL ของ backend
        changeOrigin: true, // ปรับค่า Host ให้ตรงกับ backend
        secure: false, // ปิด SSL Verification (กรณีใช้ HTTP)
      },
    },
  },
});
