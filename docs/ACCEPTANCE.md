# Acceptance audit against the supplied MVP specification

**M1 + M2 + M3 are implemented and locally validated.** The static MVP is complete within the disclosed heuristic and compatibility limits. No deployment, domain, external account, Git staging or commit occurred. Physical-device and additional-engine certification remain pre-publication checks and are not represented as tested.

| Success criterion | Evidence | Assessment |
| --- | --- | --- |
| 1. Successful build | Static build; type/lint; 52 passing tests | Verified |
| 2. All core pages | Ten routes at desktop/mobile widths; SEO, links/assets, sitemap | Verified |
| 3. MediaPipe initializes | Local GPU path and forced-failure real CPU path | Verified in tested Chromium |
| 4. Image upload | JPG selection/drag-drop, PNG/WebP, 2048px resize, EXIF | Verified |
| 5. Camera | Synthetic real live streams test granted branch, capture, switching, denial, close/hide and delayed permission | Application verified; physical permission dialog/sensor not certified |
| 6. Face detection | Actual single-face inference; blank/multiple/rotated rejection | Verified |
| 7. Landmark display | SVG/image alignment at desktop/390px, screenshots and toggles | Verified for tested fixtures |
| 8. Classification | Primary/secondary, six heuristic scores, prototype/ambiguity tests, manual choice | Function verified; no accuracy claim |
| 9. Measurements | Ratios, charts, symmetry availability, numeric and topology tests | Verified within documented limits |
| 10. Hairstyle ideas | 36 records, shape/style/length filters, original illustrations | Verified |
| 11. Glasses ideas | 18 records, six shapes, actual result cards | Verified |
| 12. Report export | Actual PNG and print-layout PDF, opt-in photo, rendered inspection | Verified |
| 13. Photos stay local | No upload code/endpoints; observed GET/HEAD, zero bodies, no storage writes, URL revocation | Architecture and observed flows verified |
| 14. Desktop/mobile | All routes at 1280px/390px, screenshots, no overflow, mobile menu | Layout verified; physical mobile untested |
| 15. SEO/sitemap | Metadata/schema/sitemap/robots; results only in memory | Verified; placeholder origin noindex |
| 16. Free/static | No accounts, payments, remote AI, backend or database | Verified |

## Explicit requirements and adjustments

- Independent directory `H:\face shapes\face-shape-studio`; no sibling projects or Cloudflare resources modified.
- Astro static, React, TypeScript, Tailwind, pinned official MediaPipe 0.10.32, float16 model version 1 and local WASM. Source/license/checksum in `THIRD_PARTY_NOTICES.md`.
- MIME/extension/signature and 10 MiB checks; EXIF-aware decoding and in-memory optimization. No original image modification/persistence. Worker and URL cleanup verified on reset; camera tracks end on capture/close/hide.
- Quality gates: face count, size, clipping, pose, gross contour consistency, lighting and blur. **General occlusion cannot be reliably detected from these landmarks.** The smallest implemented adjustment is mandatory visibility confirmation and limitations disclosed before analysis, in FAQ and methodology.
- Six-shape scoring is transparent and normalized; upper-face width is always estimated. Scores are not probabilities. No attractiveness rating or sensitive-trait inference. Formulas, indices, prototypes and thresholds are in `METHODOLOGY.md`.
- Worker inference with startup/analysis timeouts and retry/cancel. Real CPU fallback works after GPU initialization failure. **Fully unavailable WebGL prevents this pinned image pipeline from running, even on CPU**; an actionable error replaces the raw technical exception.
- Reports include date, measurements, ideas and privacy note; photo absent by default, explicit inclusion works; no automatic sharing/upload.
- No persistent/indexed result URL. FAQPage markup omitted because rich-result eligibility is not established. Configurable public email/domain; local contact routes feedback through the preview conversation.
- No QA bundles/sample photos in static output; no excluded premium/backend features simulated.
- Cloudflare preparation only: new `face-shape-studio-free`, future Git integration, `npm run build`, `dist`, Node 24.22.1+. Exact settings in `DEPLOYMENT.md`.

`QA.md` records observed behavior and limits. Evidence establishes a usable local MVP in tested Chromium, not population accuracy, reliable general occlusion detection or universal device/browser support.
