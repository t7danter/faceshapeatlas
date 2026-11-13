# Prelaunch SEO

This change was verified locally and then published to the existing [temporary Cloudflare preview](https://face-shape-studio-preview.pages.dev/) with noindex. See the [deployment record](DEPLOYMENT.md) for the live checks.

| Page | Primary intent |
| --- | --- |
| `/` | Face shape overview: how to recognize the six outlines |
| `/face-shape-detector/` | Free photo or camera tool; face shape test and calculator explained below the tool |
| `/what-is-my-face-shape/` | Manual answer and step-by-step mirror or photo check |
| `/face-shape-guide/` | Side-by-side comparison and navigation to the six guides |
| `/{heart,oval,diamond,oblong,square,round}-face-shape/` | Recognizing one outline, comparing close alternatives, hair and glasses ideas |

The homepage, detector, comparison guide and manual check link to all six guides. Each guide links to the other five and to the matching sections in the hairstyle and glasses guides. The homepage and detector share the photo analysis component. On the homepage, the model loads after a photo is selected or captured. Both tools link the automatic and secondary matches and the currently selected shape to their own guides. Result links contain no measurements, identifiers or photo data.

All 17 content pages have individual title, description, H1 and self canonical. The six guides show the parent guide in their visible breadcrumb and their `BreadcrumbList`. The homepage's five questions use the same data for the visible accordion and `FAQPage`. [Google removed FAQ rich results](https://developers.google.com/search/updates#june-2026); this markup is semantic only. The detector uses `WebApplication` with a free offer and no invented reviews. The celebrity links are references for hairstyles, not claimed biometric classifications or endorsements.

For previews, leave `PUBLIC_NOINDEX` unset or set it to `true`. Builds then include a noindex meta tag and a matching `X-Robots-Tag` in the generated Pages headers. The robots file allows crawlers to read the directive and declares the sitemap index at the configured origin. The existing temporary Pages hostname and its preview aliases stay noindex even if the flag is set to `false`. [Google's noindex guide](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

At the approved public launch, set `SITE_URL` to the final HTTPS origin and `PUBLIC_NOINDEX=false`, then run `npm run validate`. The public build removes the global noindex header and emits indexable metadata on the 17 content routes. Verify the absolute `Sitemap:` entry in robots.txt and submit `https://<final-domain>/sitemap-index.xml` in the verified Search Console property. Two to four weeks after launch, compare indexing and first impressions across the six guides, starting with the heart guide. [Google's sitemap submission guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

Verified on November 13, 2026. The homepage has 1,291 words in its main content and 1,362 across the page body. Counting both words in each of 18 “face shape” or “face shapes” matches gives a density of 2.64% across the body. The detector article has 995 words. Counts exclude head metadata, scripts, SVG and noscript, and include expandable FAQ text. Static checks passed for the 17 preview and simulated production pages, including all 30 cross-links between guides. All 52 unit tests passed. The homepage completed sample photo analysis locally and on the live preview. A simulated camera stream verified capture and cleanup. The upload and camera buttons fit in the first viewport at 320, 390 and 1280 pixels wide.
