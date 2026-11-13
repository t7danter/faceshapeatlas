import type { Landmark } from '../types';
export const indices = { top: 10, chin: 152, cheekLeft: 234, cheekRight: 454, upperLeft: 103, upperRight: 332, jawLeft: 172, jawRight: 397, jawAboveLeft: 132, jawAboveRight: 361, jawBelowLeft: 148, jawBelowRight: 377, eyeLeft: 33, eyeRight: 263, nose: 1 } as const;
export const outline = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
export const required = [...new Set([...Object.values(indices), ...outline])];
export function validateLandmarks(points: Landmark[]) {
  if (!Array.isArray(points) || points.length < 468 || required.some(i => !points[i] || ![points[i].x, points[i].y, points[i].z].every(Number.isFinite))) throw new Error('Facial landmarks are incomplete. Use a clear photo with your entire face visible.');
}
/** Converts image-normalized x/y/z to one isotropic coordinate system, with width = 1. */
export function normalizeLandmarks(points: Landmark[], width: number, height: number): Landmark[] {
  validateLandmarks(points);
  if (!(width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height))) throw new Error('Invalid image dimensions.');
  return points.map(p => ({ x: p.x, y: p.y * height / width, z: p.z }));
}
export function distance(a: Landmark, b: Landmark) { return Math.hypot(a.x - b.x, a.y - b.y); }
