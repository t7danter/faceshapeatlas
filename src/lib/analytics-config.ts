import { isSiteIndexable } from './site-indexing';

export function analyticsId(site: URL | undefined, noindex: string | undefined, measurementId: string | undefined) {
  if (site?.origin !== 'https://faceshapeatlas.com' || !isSiteIndexable(site, noindex)) return undefined;
  return /^G-[A-Z0-9]+$/.test(measurementId ?? '') ? measurementId : undefined;
}
