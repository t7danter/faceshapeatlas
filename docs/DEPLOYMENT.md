# Independent Cloudflare Pages deployment

FaceShapeAtlas launched on November 13, 2026 at [faceshapeatlas.com](https://faceshapeatlas.com/) in its own Cloudflare Pages project, `faceshapeatlas`. The user selected Direct Upload. The production branch is `main`, and the initial deployment ID starts with `a2a986c1`.

Build the production release with `SITE_URL=https://faceshapeatlas.com` and `PUBLIC_NOINDEX=false`. Deploy the verified static output to `faceshapeatlas`. The apex is a Pages custom domain. The zone's `FaceShapeAtlas WWW to apex` rule permanently redirects `www.faceshapeatlas.com` to the same path and query string on the apex. The separate temporary Pages project serves the noindex preview.

Production verification covered all 17 public pages, self canonicals, index directives, robots.txt, both sitemap files, both AI summary files, the model and WASM. A sample photo completed analysis in the browser on the production hostname. [Sitemap index](https://faceshapeatlas.com/sitemap-index.xml) · [llm.txt](https://faceshapeatlas.com/llm.txt) · [llms.txt](https://faceshapeatlas.com/llms.txt)

**Temporary deployment approved and published on November 13, 2026:** https://face-shape-studio-preview.pages.dev/. A new, independent Direct Upload Pages project was created after the user explicitly chose this method. No existing project was changed, no custom domain or external account was created, and no Git files were staged or committed.

The temporary project is `face-shape-studio-preview`. Reserve `face-shape-studio-free` for a future independent Git-integrated project if desired. Never reuse VideoFrameLab or another existing project. Do not bind a domain until separately approved.

Deployment `6fe1c265` on November 13, 2026 added the homepage photo tool, expanded the detector guide and linked the six guides to one another. The 17 live pages returned matching HTML, canonicals and noindex headers. Live checks covered robots.txt, both sitemap files, the model, WASM and homepage analysis using a sample photo.

The SEO update was published to the same temporary URL on November 13, 2026 (deployment prefix `5d4abaf1`, branch `main`). The build used `SITE_URL=https://face-shape-studio-preview.pages.dev` and `PUBLIC_NOINDEX=true`. All 17 live pages matched the built HTML and returned both the noindex meta tag and `X-Robots-Tag`; canonical URLs, robots.txt, both sitemap files and the model/WASM responses also passed. The record below describes the original deployment.

## Temporary deployment record

- Public review URL: **https://face-shape-studio-preview.pages.dev/**.
- Direct Upload with Wrangler **4.161.0**, static `dist/` only; 30 assets plus `_headers`.
- Branch `main`, deployment prefix `02251d2f`. Cloudflare labels this the temporary project's production environment; this is still an isolated review site, not a custom-domain public launch.
- Build environment: `SITE_URL=https://face-shape-studio-preview.pages.dev` and `PUBLIC_NOINDEX=true`. The final `dist/_headers` additionally includes `X-Robots-Tag: noindex, follow` under `/*`. Reapply that artifact-only header after rebuilding a temporary release; it is intentionally absent from the future production source headers.
- An initial `preview` branch deployment (`51052c8b`) was also created. Its nested Pages subdomains returned TLS handshake errors during verification; the tested project-root URL above is the delivery address.
- Project creation used `wrangler pages project create face-shape-studio-preview --production-branch main --force` to select static Pages rather than the CLI's automatic Workers delegation. Existing-project deployments use `wrangler pages deploy dist --project-name face-shape-studio-preview --branch main` without `--force`.
- No Workers, Functions, database, R2, analytics or domain bindings were added.
- This URL is public and does not depend on the local preview server. No automatic expiry or deletion was configured.
- Type checking, lint, all 52 tests and static build checks passed. Live HTTP verification passed for all ten core routes, robots, both sitemaps, both WASM variants, model, font and the 404 response (18 checks). All ten pages return the canonical review origin, noindex HTML and HTTP headers, and the same-origin security policy.
- Live Chromium verification completed GPU initialization, local analysis of the public MediaPipe sample, recommendations and an actual PNG download with the photo excluded. The 390px result layout had no horizontal overflow. The page resource list contained no external HTTP origins; IndexedDB was empty. Browser extensions added two unrelated storage keys, so this check does not claim the entire browser profile was empty. Physical camera permissions and other browser engines were not retested in this deployment pass.
- Evidence is stored locally in ignored `.local/cf-preview-20261113/`, including `http-checks.json`, `browser-checks.json`, page screenshots and `report-live.png`. None of those files or the sample portrait were deployed.

For another approved temporary release, set the two build environment variables above, run `npm run validate`, and deploy only the verified build output to this project. Current builds add the temporary `X-Robots-Tag` header automatically. See [prelaunch SEO](SEO-PRELAUNCH.md) for the page and indexing changes.

## Before publishing

1. Choose the final brand and support email. Brand text lives in `src/config.ts`; design tokens live at the top of `src/styles/global.css`. Update `public/icons/logo.svg` and `public/images/social-card.png` if rebranding.
2. Set `SITE_URL` to the approved HTTPS canonical origin and explicitly set `PUBLIC_NOINDEX=false` for the approved public launch. Verify that robots.txt declares the final origin's `/sitemap-index.xml` and submit that URL in Search Console. Preview builds declare the sitemap at their own origin and serve the noindex meta tag and response header.
3. Set `PUBLIC_CONTACT_EMAIL` to an actual monitored address. The unpublished preview instead routes feedback to the project owner through the conversation where it was shared; it does not invent a mailbox or offer a dead form.
4. Use Node **24.22.1 or a compatible newer release**. Run `npm ci` and `npm run validate`.
5. Confirm `public/models/manifest.json` matches the bundled model. `npm run build` checks its exact version 1 size, official MD5 and pinned SHA-256. The model, license and WASM assets are already included, so a normal build needs no Google/CDN model download.
6. Test the built site with `npm run preview`. It serves `dist/` on `http://127.0.0.1:4321/` and applies the same `_headers` security rules as Pages. This local HTTP server is development tooling only and is never deployed.
7. Recheck the camera over HTTPS on real target devices, mobile Safari and Firefox, as well as Chrome/Edge. Recheck model startup and CPU fallback. Do not make unsupported accuracy claims.

## Future Pages configuration

Prefer **Git integration** when a new independent GitHub repository is available. Creating that repository, staging/committing, connecting Git and deploying all remain pending explicit user instruction.

| Setting | Value |
| --- | --- |
| Project | `face-shape-studio-free` (new project) |
| Framework preset | Astro |
| Root directory | repository root if this directory is the repository |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | `NODE_VERSION=24.22.1` or compatible newer Node |
| Canonical site | `SITE_URL=https://<approved-origin>` |
| Indexing | `PUBLIC_NOINDEX=false` for the approved public launch |
| Contact | `PUBLIC_CONTACT_EMAIL=<real-monitored-address>` |
| Functions/Workers bindings | None |
| D1/R2/Queues | None |

The output is plain static files. There is no `_worker.js`, server adapter, Pages Function, database or image upload route. `_headers` constrains network connections and scripts to the same origin, permits local WebAssembly, and limits camera use to this origin. Audio, geolocation, form submission and framing are disabled.

Cloudflare's [Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) documents the build/output settings. **Do not automatically choose Direct Upload:** Cloudflare's [Direct Upload documentation](https://developers.cloudflare.com/pages/get-started/direct-upload/) states that a Direct Upload project cannot later switch to Git integration. Choose the desired project type before creation.

## Assets and limits

- Face Landmarker model: 3,758,596 bytes (about 3.6 MiB).
- SIMD WASM: about 10.9 MiB; non-SIMD WASM: about 10.2 MiB. Each is below Pages' per-file limit; only the appropriate variant is requested in the browser.
- All models, scripts and styles use root-relative paths. Deploy at the domain root, not a subpath, unless asset path handling is explicitly adapted.
- No real photos or `.local/` QA outputs belong in the deployed directory.

## After an approved deployment

Verify direct loads of all 17 core routes, canonical URLs, sitemap URLs, robots behavior, the security headers, camera permissions, model MIME types and report export. Confirm no unexpected third-party requests. Bind an approved domain only after its canonical configuration has been rebuilt and verified.
