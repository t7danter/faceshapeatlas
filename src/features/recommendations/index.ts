import data from './data/styles.json';
import type { FaceShape } from '../../config';
export type StylePreference = 'all' | 'neutral' | 'masculine' | 'feminine';
export type HairLength = 'any' | 'short' | 'medium' | 'long';
export const recommendations = data;
export function getRecommendations(shape: FaceShape, preference: StylePreference = 'all', length: HairLength = 'any') {
  const entry = data[shape];
  return { ...entry, hairstyles: entry.hairstyles.filter(item => (preference === 'all' || item.stylePreference === preference || item.stylePreference === 'neutral') && (length === 'any' || item.hairLength === length)) };
}
