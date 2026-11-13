export function isSiteIndexable(site: URL | undefined, noindex: string | undefined): boolean {
  if (noindex !== 'false' || site?.protocol !== 'https:') return false;
  const host = site.hostname;
  return host !== 'example.com' && !host.endsWith('.example') &&
    host !== 'localhost' && !host.endsWith('.localhost') &&
    host !== 'face-shape-studio-preview.pages.dev' && !host.endsWith('.face-shape-studio-preview.pages.dev');
}
