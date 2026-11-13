import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { isSiteIndexable } from './src/lib/site-indexing.ts';
import { analyticsId } from './src/lib/analytics-config.ts';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const site = process.env.SITE_URL || env.SITE_URL || 'https://example.com';
const indexable = isSiteIndexable(new URL(site), process.env.PUBLIC_NOINDEX ?? env.PUBLIC_NOINDEX);
const measurementId = analyticsId(new URL(site), process.env.PUBLIC_NOINDEX ?? env.PUBLIC_NOINDEX,
  process.env.PUBLIC_GA4_ID ?? env.PUBLIC_GA4_ID);

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap(), {
    name: 'preview-indexing-headers',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (indexable && !measurementId) return;
        const file = new URL('_headers', dir);
        let headers = await readFile(file, 'utf8');
        if (!indexable) headers = headers.replace(/^\/\*\r?$/m, '/*\n  X-Robots-Tag: noindex, follow');
        if (measurementId) {
          headers = headers
            .replace("script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';", "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com;")
            .replace("img-src 'self' blob: data:;", "img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com;")
            .replace("connect-src 'self';", "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com;");
        }
        await writeFile(file, headers);
      },
    },
  }],
  vite: { plugins: [tailwindcss()] },
});
