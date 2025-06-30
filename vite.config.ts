
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Dynamically import lovable-tagger only in development mode
const getComponentTagger = async () => {
  try {
    const { componentTagger } = await import("lovable-tagger");
    return componentTagger();
  } catch (error) {
    console.warn("lovable-tagger not available, skipping component tagging");
    return null;
  }
};

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  
  if (mode === 'development') {
    const tagger = await getComponentTagger();
    if (tagger) {
      plugins.push(tagger);
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
            icons: ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    },
  };
});
