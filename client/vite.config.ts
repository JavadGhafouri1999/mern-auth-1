import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Remove manualChunks to avoid circular init issues
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Optional: disable minification while debugging
    // minify: false,
  },
});