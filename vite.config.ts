import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for third-party libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react', '@supabase/auth-ui-react'],
          'vendor-radix': ['@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-slot'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],

          // Feature-based chunks
          'admin-core': [
            './src/components/admin/AdminLayout.tsx',
            './src/components/ProtectedRoute.tsx'
          ],
          'admin-editors': [
            './src/components/admin/Dashboard.tsx',
            './src/components/admin/HeroEditor.tsx',
            './src/components/admin/AboutEditor.tsx'
          ]
        }
      }
    }
  }
})