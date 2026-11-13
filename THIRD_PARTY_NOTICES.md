# Third-party notices and asset provenance

## MediaPipe

Copyright The MediaPipe Authors. Runtime package: `@mediapipe/tasks-vision` pinned to **0.10.32**. Local WASM JavaScript and binaries are copied from that exact installed package. The locally bundled analysis worker includes that package's code. License: Apache License, Version 2.0. Full text is distributed at `public/licenses/mediapipe-Apache-2.0.txt`.

Official model bundle, **float16 version 1**:
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task

The exact URL is linked in Google's official [Web Tasks Vision README](https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/tasks/web/vision/README.md). Model size and SHA-256 are recorded in `public/models/manifest.json`. The build verifies that checksum. The bundle includes face detector, landmark detector and blendshape components; expression output is disabled and unused.

Google's model cards identify Apache 2.0 licensing for the bundled model components:

- [FaceMesh V2 model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf)
- [BlazeFace short-range model card](https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20%28Short%20Range%29.pdf)
- [Blendshape V2 model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf)

Runtime and models are served from this website's own origin. There is no runtime CDN, third-party AI API or remote photo processing.

## Interface assets

Face, hair, frame and logo illustrations are original schematic vector drawings authored for this project. They are not real analyses or virtual try-ons. The interface's blue palette, typography and panel treatment reference VideoFrameLab; its logo, content and source code are not copied.

DM Sans is bundled locally from `@fontsource-variable/dm-sans` **5.3.0**, licensed under the SIL Open Font License 1.1. The unmodified Latin variable font is `public/fonts/dm-sans-latin-variable.woff2`; the full license is `public/licenses/dm-sans-OFL-1.1.txt`. Upstream authors: [DM Sans Project](https://github.com/googlefonts/dm-fonts). No font provider or CDN is contacted at runtime.

## QA sample

The public sample `https://storage.googleapis.com/mediapipe-assets/portrait.jpg` may be downloaded into ignored `.local/` for manual model smoke testing. It is not shipped as a product asset, test fixture, or example result. Do not copy personal photos into the repository.

## Other packages

Astro, React, Tailwind and the development tools retain their own package licenses in node_modules. The lockfile records exact transitive versions. There is no endorsement by Google or the reference sites.
