import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  const apiOrigin = new URL(env.VITE_API_URL || 'http://localhost:8000').origin

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Lets the browser open the connection to the API while the page is still loading.
      { name: 'api-origin', transformIndexHtml: { order: 'pre', handler: (html) => html.replace('%VITE_API_ORIGIN%', apiOrigin) } },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Libraries change rarely: kept in files of their own, they stay cached when the site is updated.
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return
            if (/node_modules\/(react|react-dom|scheduler|react-router)\//.test(id)) return 'react'
            if (id.includes('@fortawesome/fontawesome-svg-core') || id.includes('@fortawesome/react-fontawesome')) return 'icons'
          },
        },
      },
    },
  }
})
