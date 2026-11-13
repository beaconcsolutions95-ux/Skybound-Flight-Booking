import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Standalone configuration for local development outside Figma Make.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
