import { mkdir, copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'public');
await mkdir(path.join(target, 'mediapipe/wasm'), { recursive: true });
await mkdir(path.join(target, 'models'), { recursive: true });
await mkdir(path.join(target, 'licenses'), { recursive: true });
for (const name of await readdir(path.join(root, 'node_modules/@mediapipe/tasks-vision/wasm'))) {
  if (/\.(js|wasm)$/.test(name)) await copyFile(path.join(root, 'node_modules/@mediapipe/tasks-vision/wasm', name), path.join(target, 'mediapipe/wasm', name));
}
const modelUrl = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const modelPath = path.join(target, 'models/face_landmarker.task');
let bytes;
try { bytes = await readFile(modelPath); } catch {
  const response = await fetch(modelUrl, { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(`Official model download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 3000000) throw new Error('Invalid model download');
  await writeFile(modelPath, bytes);
}
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (bytes.length !== 3758596 || createHash('md5').update(bytes).digest('base64') !== 'sOcnSQehZEQE/vZrKN1thQ==') throw new Error('Model is incomplete or differs from the official version 1 checksum. Re-download the pinned official model.');
const manifestPath = path.join(target, 'models/manifest.json');
try {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.sha256 !== sha256) throw new Error('Model checksum differs from pinned manifest');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(manifestPath, JSON.stringify({ source: modelUrl, version: 'float16/1', runtime: '0.10.32', sha256, bytes: bytes.length, license: 'Apache-2.0' }, null, 2));
const licensePath = path.join(target, 'licenses/mediapipe-Apache-2.0.txt');
try { await readFile(licensePath); } catch {
  const response = await fetch('https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE', { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('Could not fetch MediaPipe license');
  await writeFile(licensePath, await response.text());
}
await build({ entryPoints: [path.join(root, 'src/features/face-analysis/mediapipe/worker.ts')], outfile: path.join(target, 'mediapipe/analysis-worker.js'), bundle: true, format: 'iife', platform: 'browser', target: 'es2022', minify: true, legalComments: 'eof', define: { 'import.meta.env.PUBLIC_CONTACT_EMAIL': '""' } });
console.log(`Local MediaPipe assets ready. Model SHA-256: ${sha256}`);
