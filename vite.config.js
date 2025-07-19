import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Cấu hình cho Single Page Application
  appType: 'spa',
  
  // Server config
  server: {
    open: true,
    port: 5174,
    strictPort: true,
    // Cấu hình quan trọng cho SPA - đảm bảo tất cả các route trả về index.html
    middlewareMode: false,
  },
  
  // Preview config
  preview: {
    port: 5174,
    strictPort: true,
  },

  // Build config
  build: {
    outDir: 'dist',
    // Đảm bảo tạo file fallback cho SPA routing
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  
  // Alias config
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  // Dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
