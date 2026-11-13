import { shapes, type FaceShape } from '../../../config';
import type { Classification, Measurements } from '../types';
// Engineering prototypes, not population norms. [length/cheek, upper/cheek, jaw/cheek, lower contour angle]
export const prototypes: Record<FaceShape, readonly number[]> = {
  oval: [1.38, .88, .77, 148], round: [1.15, .89, .82, 151], square: [1.20, .95, .90, 128],
  heart: [1.34, .98, .70, 143], diamond: [1.38, .77, .72, 142], oblong: [1.65, .90, .80, 146],
};
export function classify(m: Measurements): Classification {
  const features = [m.lengthToWidth, m.foreheadToCheek, m.jawToCheek, m.jawAngle];
  if (features.some(v => !Number.isFinite(v) || v <= 0)) throw new Error('Invalid measurements. Please try another photo.');
  const scale = [.18, .12, .12, 24];
  const weight = [.42, .22, .26, .10];
  const scores = shapes.map(shape => {
    const cost = prototypes[shape].reduce((sum, v, i) => sum + weight[i] * ((features[i] - v) / scale[i]) ** 2, 0);
    return { shape, score: Math.round(100 * Math.exp(-cost)) };
  }).sort((a, b) => b.score - a.score);
  const ambiguous = scores[0].score - scores[1].score < 8 || scores[0].score < 55;
  return { primary: scores[0].shape, secondary: scores[1].shape, scores, ambiguous,
    explanation: `The visible face length is ${m.lengthToWidth.toFixed(2)} times cheekbone width. The jaw is ${(m.jawToCheek * 100).toFixed(0)}% of cheekbone width and the estimated upper face is ${(m.foreheadToCheek * 100).toFixed(0)}%. These ratios, together with the lower-face contour, are compared with six geometric prototypes. ${ambiguous ? 'The match is mixed; explore both leading shapes.' : 'One prototype leads, but this is still an approximate description.'}` };
}
