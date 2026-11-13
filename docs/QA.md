# QA record

Local M1 + M2 + M3 verification completed November 12, 2026. This is an MVP engineering acceptance record, not a classification-accuracy or cross-device certification.

## Automated validation

- Astro/TypeScript: 45 files, 0 errors, 0 warnings, 0 hints.
- ESLint: passes with zero warnings allowed.
- Vitest 5.1.0: **52 tests, three suites, all passing**. Covers measurements, normalization, six-shape scoring, missing landmarks, invalid input, zero/multiple faces, poor pose, ambiguity, recommendations and reports. The closed outline is checked against the pinned official MediaPipe topology.
- Production build: **11 static pages** (ten requested pages plus 404), sitemap and robots.txt.
- Static verifier: unique titles/descriptions, one H1 per static page, canonical/Open Graph/Twitter metadata, structured data, local links/assets, sitemap, no QA/backend output and Pages per-file limits.
- Output: 29 files, approximately 25.6 MiB; largest asset 11,453,626 bytes.
- Dependency audit after pinning updates and a targeted minimatch override: zero reported vulnerabilities.
- Official model version 1: 3,758,596 bytes; MD5 `b0e7274907a1644404fef66b28dd6d85`; SHA-256 `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`. Verified during every build.

## Browser analysis and inputs

Tested in Chromium-based ego-browser using production static output and Cloudflare-equivalent security headers.

- GPU initialization and actual inference succeed with bundled local model/WASM. A public MediaPipe portrait produces 478 landmarks, primary/secondary shapes, six scores, ratios, explanations and recommendations. This smoke sample is not accuracy evidence.
- Forced GPU initialization failure exercises real CPU fallback and inference: **478 landmarks, CPU delegate**, successful geometric result. A main-thread heartbeat continues during worker processing.
- Disabling WebGL entirely gives a friendly compatibility error. This pinned image pipeline requires WebGL preprocessing even with CPU inference; CPU fallback is not WebGL-free operation.
- JPG selection and drag/drop work. Synthetic PNG decodes to 300×180; 3000×1800 WebP resizes to 2048×1229; EXIF orientation 6 JPEG decodes to 180×300 from a 300×180 source.
- Blank image: explicit no-face error. Two sample faces: explicit multiple-face error. A 22° rotated sample: upright-head guidance. None produces a classification.
- Manual heart selection preserves automatic Diamond result; masculine/short filters produce two applicable suggestions. All six mappings are also unit-tested.
- Overlay switches remove all SVG children when off. Desktop/mobile image and overlay bounds match. Final 390px test: both x=18, width=354.4, height=442.56, no horizontal overflow. Screenshot follows the face contour.

## Camera and resource lifecycle

Camera tests substitute `getUserMedia` with **real canvas-generated MediaStreams** and controlled rejection/pending promises, avoiding capture of the user's surroundings. They test application branches and video/canvas/track lifecycle, not OS permission dialogs or physical sensors.

- Zero permission calls until explicit camera start; video-only constraints, `audio:false`.
- Front/rear selection changes `facingMode`; previous tracks end before replacement.
- A 640×480 live stream plays, captures an in-memory JPG preview, closes the panel and ends all stream tracks.
- `NotAllowedError` gives permission/upload guidance; closing the panel allows continued use.
- Closing during pending permission ends the stream when it eventually arrives; no stale preview appears.
- Simulated hidden-page event ends tracks and restores the camera-start control.
- Reset removes photo/results, revokes the photo URL, terminates one worker and creates one replacement. Fetching the revoked URL fails. Instrumented actions record no unhandled errors.
- Source handles stale decode/capture callbacks, pagehide and persisted-pageshow restart. Back-forward-cache handling was reviewed in source; not every browser cache policy was exercised.

## Reports and layout

- Actual PNG downloads with and without a photo were visually inspected.
- Print button invokes `window.print`; actual PDFs contain date, measurements, recommendations and privacy note. Default PDF has zero embedded images; opt-in has exactly one. DOM checks verify 0 → 1 → 0 photos as the inclusion checkbox changes.
- The two-page photo PDF was rendered and visually checked; the default filtered report fits one page. Product report generation is entirely browser-side.
- All ten routes load at 390px/1280px without horizontal overflow, broken images or external page resources. Representative home, guide, hairstyle/glasses cards, FAQ and results were visually reviewed. Mobile navigation and FAQ expansion work.
- Static content pages do not request MediaPipe/model assets; the tool does.

## Privacy observations

- Preview audit contains only GET/HEAD, zero request bodies (207 requests at the recorded audit point). No image upload/API request observed.
- Page resources are same-origin. Source has no upload, analytics, remote AI or image/landmark persistence writer. CSP restricts connections to the site's origin.
- Instrumented upload, camera, inference, export and reset record no Storage writes. No IndexedDB databases or cookies found.
- Existing extension keys `extendedvaluekey` and `__imt_handshake_page_id` contain no image-like content; the app uses neither. The whole browser profile is not claimed empty.
- Static assets require network downloads. Reports are user-controlled downloads, with photo inclusion off by default.

## Evidence and limits

Ignored `.local/` contains scripts, JSON observations, logs, screenshots, reports and the public sample. The final rebuild removes QA-only delegate workers; the static verifier rejects those bundles or sample photos in `dist/`. No real user photos are test fixtures or deployment assets.

Physical cameras, real mobile hardware, Firefox, Safari and standalone Edge were not tested. Recheck over HTTPS before publication; camera selection is an ideal constraint and some devices have one sensor. Classification/quality thresholds are not population-calibrated. General occlusion requires the disclosed user visibility confirmation. Public contact email and canonical domain remain intentionally unset. See `ACCEPTANCE.md`, `METHODOLOGY.md` and `DEPLOYMENT.md`.
