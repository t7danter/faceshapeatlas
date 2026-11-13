import type { Landmark, Pose } from '../types';
import { indices as I, outline, validateLandmarks, distance, normalizeLandmarks } from '../landmarks';
export class QualityError extends Error { constructor(public issues: string[]) { super(issues.join(' ')); this.name = 'QualityError'; } }
/** MediaPipe Face Geometry matrix is column-major. Normalize out uniform scale before Euler extraction. */
export function estimatePose(data: number[] | undefined): Pose {
  if (!data || data.length !== 16 || data.some(n => !Number.isFinite(n))) throw new QualityError(['Head pose could not be verified. Try another level, front-facing photo.']);
  const sx = Math.hypot(data[0], data[1], data[2]);
  const sy = Math.hypot(data[4], data[5], data[6]);
  const sz = Math.hypot(data[8], data[9], data[10]);
  if (Math.min(sx,sy,sz) < 1e-6) throw new QualityError(['Head pose could not be measured.']);
  const degrees = 180 / Math.PI;
  return { yaw: Math.asin(Math.max(-1, Math.min(1, -data[2] / sx))) * degrees, pitch: Math.atan2(data[6] / sy, data[10] / sz) * degrees, roll: Math.atan2(data[1] / sx, data[0] / sx) * degrees };
}
export function validateFaceGeometry(faces: Landmark[][], width: number, height: number, pose?: Pose) {
  if (!faces.length) throw new QualityError(['No face detected. Choose a clear photo with one visible, front-facing face.']);
  if (faces.length !== 1) throw new QualityError(['More than one face detected. Use a photo of just one person.']);
  validateLandmarks(faces[0]);
  const points = faces[0], p = normalizeLandmarks(points, width, height);
  const issues: string[] = [];
  const faceWidth = distance(p[I.cheekLeft], p[I.cheekRight]);
  if (faceWidth < .18 || faceWidth * width < 140) issues.push('Move closer to the camera. Your face needs to be larger and clearer in the photo.');
  if (outline.some(i => points[i].x < .015 || points[i].x > .985 || points[i].y < .015 || points[i].y > .985)) issues.push('Make sure your entire face is inside the photo, with a little space around it.');
  if (pose && (Math.abs(pose.yaw) > 10 || Math.abs(pose.pitch) > 10)) issues.push('Please face the camera directly at eye level. Avoid turning your head or looking up or down.');
  if (pose && Math.abs(pose.roll) > 10) issues.push('Keep your head upright. Avoid tilting toward either shoulder.');
  const left = distance(p[I.nose], p[I.cheekLeft]), right = distance(p[I.nose], p[I.cheekRight]);
  if (Math.min(left, right) / Math.max(left, right) < .55) issues.push('The facial outline is uneven or partly hidden. Face forward and remove objects covering your face.');
  if (issues.length) throw new QualityError(issues);
}
export function imageQuality(data: Uint8ClampedArray, width: number, height: number) {
  const gray = new Float32Array(width * height);
  let total = 0;
  for (let i=0;i<gray.length;i++) { gray[i] = .2126*data[i*4]+.7152*data[i*4+1]+.0722*data[i*4+2]; total += gray[i]; }
  let sum = 0, squares = 0, count = 0;
  for (let y=1;y<height-1;y++) for (let x=1;x<width-1;x++) { const i = y*width+x; const value = 4*gray[i]-gray[i-1]-gray[i+1]-gray[i-width]-gray[i+width]; sum+=value; squares+=value*value; count++; }
  return { brightness: total / gray.length, sharpness: count ? squares/count - (sum/count)**2 : 0 };
}
export function validateImageQuality(q: { brightness: number; sharpness: number }) {
  const issues: string[] = [];
  if (q.brightness < 40) issues.push('Use a brighter environment with soft, even light on your face.');
  if (q.brightness > 235) issues.push('The face is overexposed. Move away from harsh light and retake your photo.');
  if (q.sharpness < 18) issues.push('Your photo is too blurry for reliable measurements. Hold still and focus on your face.');
  if (issues.length) throw new QualityError(issues);
}
