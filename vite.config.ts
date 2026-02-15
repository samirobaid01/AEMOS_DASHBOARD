import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import type { ViteDevServer, UserConfig } from 'vite'

// Custom plugin to optimize component loading and bundling
const optimizeComponentsPlugin = () => {
  return {
    name: 'optimize-components-plugin',
    // Add component modules to preload during development
    configureServer(server: ViteDevServer) {
      // Warm up the module cache for common component paths
      server.moduleGraph.onFileChange = (file: string) => {
        if (file.includes('/components/')) {
          const modulePath = file.replace(/\.[^/.]+$/, '');
          server.moduleGraph.getModuleByUrl(modulePath);
        }
      };
    },
    // Generate optimized chunks in build
    config(_config: UserConfig) {
      return {
        build: {
          rollupOptions: {
            output: {
              manualChunks(id: string) {
                // Group by module type
                if (id.includes('node_modules')) {
                  if (id.includes('react') || id.includes('redux') || id.includes('router')) {
                    return 'vendor-react';
                  }
                  return 'vendor-other';
                }
                
                // Group by component type
                if (id.includes('/components/')) {
                  const moduleName = id.split('/components/')[1].split('/')[0];
                  return `component-${moduleName}`;
                }

                // Group by container type
                if (id.includes('/containers/')) {
                  const moduleName = id.split('/containers/')[1].split('/')[0];
                  return `container-${moduleName}`;
                }
              }
            }
          }
        }
      };
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    optimizeComponentsPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Optimize dev server to reduce direct file requests
  server: {
    fs: {
      strict: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-redux']
  }
})
