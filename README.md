# FaceShapeAtlas — free, local-first MVP

[Visit FaceShapeAtlas](https://faceshapeatlas.com/), a static Astro website with React, TypeScript, Tailwind CSS and MediaPipe Face Landmarker. Photo analysis, style recommendations and reports run in the browser. Visitors can opt in to page-visit analytics on the production site.

## Start locally

Requires Node **24.22.1+** (24.x) or 26+. The older Node 22.14 installed globally on the development machine is not sufficient for the current Astro release. Development was validated using the already bundled Node 24.22.1; no global Node installation was changed.

```sh
npm ci
npm run assets
npm run dev
```

Development URL: `http://127.0.0.1:4321/`. For a production-equivalent local preview:

```sh
npm run validate
npm run preview
```

On the current Windows machine, `./Start-Preview.ps1` selects a compatible installed Node runtime (including Codex's bundled Node 24) without changing the global Node installation. Use `./Start-Preview.ps1 -Validate` to check and rebuild before serving.

`validate` runs type checking, lint, unit tests, local asset verification and a static production build. `preview` serves the built `dist/` with the Cloudflare security headers and records request methods/paths (never bodies) in ignored `.local/preview-requests.jsonl`. Stop it with Ctrl+C. The preview server is not part of the deployed site.

## Pages

| Route | Primary intent |
| --- | --- |
| `/` | Discover face shape and personal style |
| `/face-shape-detector/` | Face shape detector |
| `/face-shape-guide/` | Understand six face shape categories |
| `/hairstyles-for-face-shapes/` | Hairstyle ideas by face shape |
| `/glasses-for-face-shapes/` | Frame style guidance |
| `/face-proportions/` | Explain facial ratios and symmetry |
| `/faq/` | Product, photo and privacy questions |
| `/privacy/` | Local image processing policy |
| `/about/` | Product and methodology |
| `/contact/` | Feedback route without a backend form |

The six standalone guides live at `/{heart,oval,diamond,oblong,square,round}-face-shape/`; the manual check is at `/what-is-my-face-shape/`. There is also a static 404 page, sitemap index, sitemap and robots.txt. Each content page has its own title, description, canonical, Open Graph and Twitter metadata. The homepage marks up its five visible FAQs as Schema.org `FAQPage`; the detector uses `WebApplication` with a zero-price offer. Results remain in memory on the tool route and link to the public guides by shape, without passing photo or measurement data in URLs.

## How analysis works

The tool lazily starts a classic Web Worker only on the tool page. MediaPipe Tasks Vision **0.10.32** uses the official Face Landmarker **float16 version 1** model and local WASM assets. It attempts the GPU delegate, then CPU on initialization failure. Inference does not block the main UI thread. Initialization and analysis have bounded timeouts with retry/cancel controls. The pinned image pipeline still requires browser WebGL with CPU processing; unavailable graphics produce an actionable error instead of a result.

Input supports JPG/JPEG, PNG and WebP up to 10 MiB. The decoder applies EXIF orientation, creates a maximum-2048px copy in memory, and validates actual file signatures. Originals are not changed. Image URLs are revoked and the worker is terminated on reset or leaving; camera tracks stop on capture, close, page hide and unmount.

The quality gates check face count, size, clipping, approximate ±10° head pose, gross contour inconsistency, exposure and blur. A mandatory user visibility check supplements the limited automatic occlusion checks. The geometric engine measures selected landmark distances using corrected aspect-ratio coordinates. It returns all six independent heuristic match scores, two leading shapes, an ambiguity explanation and descriptive ratios. **Scores are not probabilities. There is no beauty rating.**

See [the full formulas, indices and thresholds](docs/METHODOLOGY.md). Licensing, official model URLs and provenance are recorded in [third-party notices](THIRD_PARTY_NOTICES.md) and `public/models/manifest.json`.

## Recommendations and reports

The local JSON database has **36 hairstyle entries and 18 glasses entries** across oval, round, square, heart, diamond and oblong shapes. Each shape also includes volume, parting and styling considerations. The user can change the explored shape, style direction and hair length. Gender, ethnicity and identity are never inferred. Original schematic illustrations accompany the ideas.

Print / Save PDF uses a dedicated print layout. PNG export draws a compact visual report locally. The date, main measurements, suggestions and privacy note are included; the photo is excluded unless the user opts in. Manual shape selection remains distinct from the automatic classification. There are no sharing uploads.

## Configuration and deployment

- Brand: `src/config.ts`; colors/radii/type: `src/styles/global.css`.
- Current interface follows VideoFrameLab's blue-and-white visual direction with a locally bundled DM Sans font. See [UI refresh and browser checks](docs/UI-REFRESH.md).
- Canonical origin: build-time `SITE_URL`.
- Real contact address: build-time `PUBLIC_CONTACT_EMAIL`.
- Temporary previews are noindex by default. For an approved launch, build with the final HTTPS `SITE_URL` and `PUBLIC_NOINDEX=false`. See [prelaunch SEO](docs/SEO-PRELAUNCH.md).
- Production Google Analytics measurement ID: build-time `PUBLIC_GA4_ID`. The tag loads on `https://faceshapeatlas.com` after opt-in. Photo inputs and results stay on the device.
- Build: **`npm run build`**; output: **`dist`**.
- The **faceshapeatlas** Cloudflare Pages project serves production by Direct Upload. The **face-shape-studio-preview** project serves the separate noindex preview. See [the deployment record and checklist](docs/DEPLOYMENT.md).

## Validation and remaining limits

The local M1 + M2 + M3 implementation is complete. Type checking, lint, all **52 unit tests**, production build and static-output verification pass. See [QA evidence and compatibility limits](docs/QA.md) and the [acceptance audit](docs/ACCEPTANCE.md) for the exact tested scope. Synthetic fixtures verify calculations and failure paths without storing user photos. Browser smoke testing uses a public MediaPipe sample only in ignored `.local/`. Camera lifecycle tests use real synthetic MediaStreams; physical camera permission dialogs and other browser engines remain a pre-publication device check.

The classifier and quality thresholds are engineering heuristics, not population-calibrated standards. Hairline, general occlusion and physical millimeter measurements are not reliably recoverable from one photograph. Glasses/hair are suggestions, not virtual try-ons. Camera hardware and browser resource limits vary; cross-device release testing is still important. The local contact route is intentionally honest until an actual support email is supplied.
