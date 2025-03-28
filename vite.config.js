import { defineConfig } from "vite";
// import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser";

export default defineConfig(({ mode }) => {
  const BASE_URL = process.env.BASE_URL;
  const PORT = parseInt(process.env.PORT) || 3000;
  
  return {
    plugins: [
      react(),
      mode === "production" && terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: true,
        format: {
          comments: false
        }
      })
    ],
    build: {
      minify: mode === "production",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          inlineDynamicImports: true,
          compact: true
        }
      }
    },
    server: {
      port: PORT,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    }
  };
});
