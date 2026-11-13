import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[2] || 'dist');
const shapeRoutes = ['heart', 'oval', 'diamond', 'oblong', 'square', 'round'].map(shape => '/'+shape+'-face-shape/');
const routes = [
  '/', '/face-shape-detector/', '/face-shape-guide/', '/hairstyles-for-face-shapes/',
  '/glasses-for-face-shapes/', '/face-proportions/', '/faq/', '/privacy/', '/about/', '/contact/',
  '/what-is-my-face-shape/', ...shapeRoutes,
];
const read = (file) => readFile(path.join(root, file), 'utf8');
const canonicalOf = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const robotsOf = (html) => html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
const home = await read('index.html');
const origin = new URL(canonicalOf(home)).origin;
const mode = process.argv[3] || robotsOf(home)?.split(',')[0];
assert(['index', 'noindex'].includes(mode), 'Expected index or noindex mode');
const robots = await read('robots.txt');
const headers = await read('_headers');
const sitemapIndex = await read('sitemap-index.xml');
assert(robots.includes('Allow: /') && !robots.includes('Disallow: /'), 'Crawlers need access to the index directive');
assert(robots.split(/\r?\n/).includes('Sitemap: '+origin+'/sitemap-index.xml'), 'Missing same-origin sitemap in robots.txt');
assert.equal(/^ {2}X-Robots-Tag:\s*noindex\b/im.test(headers), mode === 'noindex', 'Unexpected X-Robots-Tag policy');
assert(sitemapIndex.includes(origin+'/sitemap-0.xml'), 'Sitemap index origin mismatch');
assert.equal(robotsOf(await read('404.html')), 'noindex, follow');

const titles = new Set(), descriptions = new Set(), records = [];
const sitemap = await read('sitemap-0.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(sitemapUrls.sort(), routes.map(route => origin + route).sort(), 'Sitemap URLs differ from the public page inventory');
const aiSummary = await read('llms.txt');
assert(aiSummary.startsWith('# FaceShapeAtlas\n\n> '), 'Missing AI summary heading or overview');
assert.equal(await read('llm.txt'), aiSummary, 'AI summary filenames serve different content');
const summaryLinks = [...aiSummary.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
assert(summaryLinks.length >= 16, 'AI summary is missing links to its guides');
for (const url of summaryLinks) {
  assert(sitemapUrls.includes(url) || url === origin + '/sitemap-index.xml', 'Unexpected AI summary link: ' + url);
}
for (const route of routes) {
  const html = await read(path.join(route, 'index.html'));
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
  assert(title && description && h1, 'Missing title, description or H1 on '+route);
  assert(!titles.has(title) && !descriptions.has(description), 'Duplicate metadata on '+route);
  titles.add(title);
  descriptions.add(description);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'Heading count on '+route);
  assert.equal(canonicalOf(html), origin + route, 'Incorrect canonical on '+route);
  assert.equal(robotsOf(html), mode+', follow', 'Incorrect index directive on '+route);
  for (const name of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:image']) {
    assert(html.includes('"'+name+'"'), 'Missing '+name+' on '+route);
  }
  const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] || '[]');
  assert(structured.some(entry => entry['@type'] === 'WebSite' && entry.url === origin+'/'), 'Missing site schema on '+route);
  if (route !== '/') {
    const crumbs = structured.find(entry => entry['@type'] === 'BreadcrumbList')?.itemListElement;
    assert.equal(crumbs?.at(-1)?.item, origin + route, 'Missing or invalid breadcrumb on '+route);
    assert(html.includes('aria-label="Breadcrumb"'), 'Missing visible breadcrumb on '+route);
    if (shapeRoutes.includes(route)) {
      assert.equal(crumbs[1]?.item, origin+'/face-shape-guide/');
      for (const guide of shapeRoutes.filter(guide => guide !== route)) {
        assert(html.includes('href="'+guide+'"'), 'Missing comparison link '+guide+' on '+route);
      }
      const shape = route.slice(1, -'-face-shape/'.length);
      for (const style of ['hairstyles', 'glasses']) {
        assert(html.includes('href="/'+style+'-for-face-shapes/#'+shape+'"'), 'Missing '+style+' link on '+route);
      }
    }
  }
  if (route === '/') {
    assert(/face shape/i.test(h1) && !/detector/i.test(h1 + title), 'Homepage should target face shape');
    const questions = structured.find(entry => entry['@type'] === 'FAQPage')?.mainEntity;
    const visible = [...html.matchAll(/<details><summary>([^<]+)<span[^>]*>\+<\/span><\/summary><p>([^<]+)<\/p><\/details>/g)];
    assert.equal(questions?.length, 5, 'Expected five homepage FAQ entities');
    assert.equal(visible.length, 5, 'Expected five visible homepage FAQs');
    questions.forEach(({ name, acceptedAnswer }, i) => {
      assert.equal(name, visible[i][1]);
      assert.equal(acceptedAnswer.text, visible[i][2]);
    });
  }
  if (route === '/face-shape-detector/') {
    const app = structured.find(entry => entry['@type'] === 'WebApplication');
    assert.match(h1, /face shape detector/i);
    assert.equal(app?.url, origin + route);
    assert.equal(app?.offers?.price, 0);
    assert.equal(app?.isAccessibleForFree, true);
  }
  if (route === '/' || route === '/face-shape-detector/') {
    assert(html.includes('type="file"') && html.includes('Use my camera'), 'Missing photo or camera entry on '+route);
  } else {
    assert(!html.includes('FaceTool.') && !html.includes('analysis-worker'), 'Analysis code leaked to '+route);
  }
  if (route === '/glasses-for-face-shapes/') assert.match(h1, /glasses for face shapes/i);
  if (route === '/face-proportions/') assert.match(h1, /facial proportions/i);
  if (['/', '/face-shape-guide/', '/what-is-my-face-shape/', '/glasses-for-face-shapes/'].includes(route)) {
    for (const guide of shapeRoutes) assert(html.includes('href="'+guide+'"'), 'Missing '+guide+' link from '+route);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const linked = match[1];
    if (linked.startsWith('//')) continue;
    const target = path.join(root, decodeURIComponent(linked));
    const info = await stat(target).catch(() => null);
    assert(info, 'Missing local asset/link '+linked+' on '+route);
    if (info.isDirectory()) await stat(path.join(target, 'index.html'));
  }
  records.push({ route, title, description, h1, characters: html.length });
}

const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const file = path.join(dir, name), info = await stat(file);
    if (info.isDirectory()) await walk(file);
    else files.push({ path: path.relative(root, file), bytes: info.size });
  }
}
await walk(root);
assert(!files.some(file => /qa-|portrait|_worker\.js|^functions[\\/]/.test(file.path)), 'QA or backend files in deploy output');
assert(files.every(file => file.bytes < 25*1024*1024), 'An asset exceeds Pages per-file size limit');
assert(files.some(file => file.path === path.join('images', 'social-card.png')), 'Missing social image');
await mkdir('.local', { recursive: true });
const report = mode === 'index' ? '.local/static-verification-indexable.json' : '.local/static-verification.json';
await writeFile(report, JSON.stringify({
  origin, mode, pages: records, files: files.length, bytes: files.reduce((sum, file) => sum + file.bytes, 0),
  maxAsset: files.sort((a, b) => b.bytes - a.bytes)[0],
}, null, 2));
console.log('Static verification passed: '+routes.length+' core routes, '+mode+' policy, metadata, schema, links/assets, sitemap and Pages output limits.');
