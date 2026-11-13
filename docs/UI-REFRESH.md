# UI refresh — November 13, 2026

Reference: [VideoFrameLab](https://videoframelab.com/), inspected in the browser. This update adopts its visual direction while retaining FaceShape Studio's identity and existing analysis workflow.

## Design

- Deep navy `#14233f` text, bright blue `#104feb` actions, pale `#f6f8fd` canvas, white panels and `#dce5f5` borders.
- Locally bundled DM Sans variable font, 36,932 bytes, from Fontsource 5.3.0 under OFL-1.1; full license shipped. No runtime font/CDN requests.
- Compact navigation and original blue face-outline mark; centered homepage heading, paired actions and clear privacy notes.
- Two-panel homepage illustration/report example with explicit example labels. Real face analysis still starts on the detector route.
- Consistent upload panels, guide cards, recommendation filters, result charts, report actions and blue PNG report palette.
- Responsive single-column mobile flow; preserved accessible focus states, semantic navigation, reduced-motion handling and print-only report layout.

## Verification

- Full `scripts/validate.mjs`: 46 checked files with zero errors/warnings/hints; ESLint passes; all 52 tests pass; 11 static pages build; static metadata/link/asset checks pass.
- Ten requested routes at 320px, 390px and 1280px: **30 layout checks**, no horizontal overflow, broken images or external page resources.
- Visual review of desktop/mobile homepage, illustrative report, upload workspace, hairstyle guide, actual results and filtered recommendations.
- Actual local GPU inference with the existing public QA sample: primary/secondary result, measurements and recommendations display correctly. The algorithm and quality thresholds are unchanged.
- Mobile image and SVG overlay both measure 354.4×442.56px; no result-page overflow.
- Manual Heart + masculine/short filters return two hair ideas and three frame ideas. Mobile menu and FAQ expansion work. Reset clears the result and photo and restarts the local engine.
- Actual blue PNG downloaded and visually reviewed. Printed PDF rendered and inspected: one page for the tested filtered report, zero embedded images by default, privacy note present. Print mode hides screen controls and uses a white background.
- Deployment output contains 31 static files, including the font and its license. No QA sample or QA script is included.

Ignored `.local/ui-refresh-20261113/` holds browser observations, screenshots and test reports. No backend, external AI, persistence, staging, commit or deployment was added. The earlier physical-camera/browser-engine limits in `QA.md` still apply.
