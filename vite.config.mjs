import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    optimizeDeps: {
        include: ['react-icons/io', 'jotai']
    },
    plugins: [
        react(),
        tailwindcss()
    ],
    base: './',
});