import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { faqs, features, steps } from './src/content/landing.js'
import { FACEBOOK_PAGE } from './src/content/contact.js'
import { daily } from './src/content/daily.js'
import { PAGES, UPDATED } from './src/content/legal.js'
import { exams } from './src/lib/data.js'

/** Writes seo-content.json next to index.html: Laravel uses it to put the same texts into the first HTML. */
function seoContent(env) {
  let outDir
  return {
    name: 'seo-content',
    apply: 'build',
    configResolved: (config) => {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle: () => {
      writeFileSync(path.join(outDir, 'seo-content.json'), JSON.stringify({ faqs, features, steps, daily, exams, contact: { email: env.VITE_CONTACT_EMAIL || null, facebook: env.VITE_FACEBOOK_URL || FACEBOOK_PAGE }, legal: { updated: UPDATED, pages: PAGES } }))
    },
  }
}

/**
 * Every Font Awesome icon becomes a module of its own. The package is one single module, so all icons of all
 * pages would otherwise end up in the file that every visitor loads first.
 */
function singleIcons() {
  const require = createRequire(import.meta.url)
  return {
    name: 'single-icons',
    apply: 'build',
    enforce: 'pre',
    transform: (code, id) => {
      if (id.includes('node_modules') || !code.includes('@fortawesome/free-')) return
      const toModules = (_, names, set) =>
        names.split(',').map((name) => name.trim()).filter(Boolean).map((name) => `import { ${name} } from "virtual:fa/${set}/${name.split(/\s/)[0]}";`).join('')
      return { code: code.replace(/import\s*\{([^}]*)\}\s*from\s*["']@fortawesome\/(free-\w+-svg-icons)["'];?/g, toModules), map: null }
    },
    resolveId: (id) => (id.startsWith('virtual:fa/') ? `\0${id}` : undefined),
    load: (id) => {
      if (!id.startsWith('\0virtual:fa/')) return
      const [set, name] = id.split('/').slice(1)
      const icon = require(`@fortawesome/${set}`)[name]
      if (!icon) throw new Error(`No icon "${name}" in @fortawesome/${set}`)
      const [width, height, , , path] = icon.icon
      return { code: `export const ${name} = ${JSON.stringify({ prefix: icon.prefix, iconName: icon.iconName, icon: [width, height, [], '', path] })}`, moduleSideEffects: false }
    },
  }
}

/** The pages (or the entry) that load this module as soon as they open. */
function usedBy(id, getModuleInfo, seen = new Set()) {
  if (seen.has(id)) return []
  seen.add(id)
  const info = getModuleInfo(id)
  const own = info.isEntry ? ['entry'] : info.dynamicImporters.length ? [id.replaceAll('\\', '/')] : []
  return [...new Set([...own, ...info.importers.flatMap((importer) => usedBy(importer, getModuleInfo, seen))])]
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  const src = `${__dirname.replaceAll('\\', '/')}/src/`
  const apiOrigin = new URL(env.VITE_API_URL || 'http://localhost:8000').origin

  return {
    plugins: [
      react(),
      tailwindcss(),
      singleIcons(),
      seoContent(env),
      // Lets the browser open the connection to the API while the page is still loading.
      { name: 'api-origin', transformIndexHtml: { order: 'pre', handler: (html) => html.replace('%VITE_API_ORIGIN%', apiOrigin) } },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // The same markup without the Font Awesome engine
        '@fortawesome/react-fontawesome': path.resolve(__dirname, './src/components/FontAwesomeIcon.jsx'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          codeSplitting: {
            groups: [
              // Libraries change rarely: kept in a file of their own, they stay cached when the site is updated.
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|tailwind-merge|clsx)[\\/]/, priority: 2 },
              {
                priority: 1,
                name: (id, context) => {
                  const icon = id.startsWith('\0virtual:fa/')
                  if (!icon && !id.replaceAll('\\', '/').startsWith(src)) return null
                  const users = usedBy(id, (module) => context.getModuleInfo(module))
                  if (users.length < 2) return null
                  // What every page needs, in one file instead of many small ones.
                  if (users.includes('entry')) return 'common'
                  // Icons of several pages share one file for the website and one for the app; the rest stay with their page.
                  if (icon) return users.some((user) => user.includes('/pages/public/')) ? 'icons-site' : 'icons-app'
                  return null
                },
              },
            ],
          },
        },
      },
    },
  }
})
