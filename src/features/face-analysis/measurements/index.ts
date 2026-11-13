import { indices as I, normalizeLandmarks, distance } from '../landmarks';
import type { Landmark, Measurements, Pose } from '../types';
export function angle(a: Landmark, vertex: Landmark, c: Landmark) {
  const ux = a.x - vertex.x, uy = a.y - vertex.y, vx = c.x - vertex.x, vy = c.y - vertex.y;
  const denominator = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  if (denominator < 1e-8) throw new Error('The lower face contour could not be measured. Try another photo.');
  return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / denominator))) * 180 / Math.PI;
}
export function measure(points: Landmark[], width: number, height: number, pose: Pose): Measurements {
  const p = normalizeLandmarks(points, width, height);
  const length = distance(p[I.top], p[I.chin]);
  const cheek = distance(p[I.cheekLeft], p[I.cheekRight]);
  const jaw = distance(p[I.jawLeft], p[I.jawRight]);
  const upper = distance(p[I.upperLeft], p[I.upperRight]);
  if (Math.min(length, cheek, jaw, upper) < .01) throw new Error('Face proportions could not be measured reliably.');
  const jawAngle = (angle(p[I.jawAboveLeft], p[I.jawLeft], p[I.jawBelowLeft]) + angle(p[I.jawAboveRight], p[I.jawRight], p[I.jawBelowRight])) / 2;
  const top = p[I.top], chin = p[I.chin];
  const axis = { x: (chin.x - top.x) / length, y: (chin.y - top.y) / length };
  // Mirror each left point across the top-to-chin line, then measure mismatch.
  const pairs = [[33,263],[234,454],[172,397],[103,332]];
  const deviation = pairs.reduce((sum, [a,b]) => {
    const dx = p[a].x - top.x, dy = p[a].y - top.y;
    const projection = dx * axis.x + dy * axis.y;
    const reflected = { x: top.x + 2 * projection * axis.x - dx, y: top.y + 2 * projection * axis.y - dy, z: 0 };
    return sum + distance(reflected, p[b]) / cheek;
  }, 0) / pairs.length;
  return { lengthToWidth: length / cheek, cheekToJaw: cheek / jaw, foreheadToCheek: upper / cheek, jawToCheek: jaw / cheek, jawAngle, symmetryDeviation: Math.abs(pose.yaw) <= 5 && Math.abs(pose.pitch) <= 5 ? deviation : null, foreheadEstimated: true };
}
